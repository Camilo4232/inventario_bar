const rol = localStorage.getItem('rol');
if (!rol) window.location.href = 'login.html';

document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('reportes-tbody');
    const resumenLista = document.getElementById('resumen-lista');
    const filtroProducto = document.getElementById('filtro-producto');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const fechaDesde = document.getElementById('fecha-desde');
    const fechaHasta = document.getElementById('fecha-hasta');

    async function cargarFiltros() {
        const [productos, categorias] = await Promise.all([
            fetch('php3/obtener_productos.php').then(res => res.json()),
            fetch('php4/obtener_categorias.php').then(res => res.json())
        ]);

        productos.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.nombre;
            filtroProducto.appendChild(option);
        });

        categorias.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.nombre;
            filtroCategoria.appendChild(option);
        });
    }

    function filtrarReportes() {
        const desde = fechaDesde.value;
        const hasta = fechaHasta.value;
        const producto = filtroProducto.value;
        const categoria = filtroCategoria.value;

        const filtros = {
            desde: desde,
            hasta: hasta,
            producto: producto,
            categoria: categoria
        };

        fetch('php2/filtrar_movimientos.php', {
            method: 'POST',
            body: JSON.stringify(filtros),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => mostrarReportes(data))
        .catch(error => {
            console.error('Error al filtrar reportes:', error);
            tbody.innerHTML = '<tr><td colspan="5">Error al cargar los datos.</td></tr>';
        });
    }

    function mostrarReportes(data) {
        tbody.innerHTML = '';
        resumenLista.innerHTML = '';

        // Mostrar movimientos
        data.movimientos.forEach(mov => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${mov.fecha}</td>
                <td>${mov.tipo}</td>
                <td>${mov.producto}</td>
                <td>${mov.categoria}</td>
                <td>${mov.cantidad}</td>
            `;
            tbody.appendChild(tr);
        });

        // Agrupar ventas por producto
        const ventasPorProducto = {};
        data.movimientos.forEach(mov => {
            if (mov.tipo === 'Venta') {
                if (!ventasPorProducto[mov.producto]) {
                    ventasPorProducto[mov.producto] = 0;
                }
                ventasPorProducto[mov.producto] += parseInt(mov.cantidad);
            }
        });

        // Mostrar resumen actualizado (entradas, salidas + ventas, stock)
        data.resumen.forEach(res => {
            const ventas = ventasPorProducto[res.producto] || 0;
            const salidasTotales = parseInt(res.salidas) + ventas;
            const stock = parseInt(res.entradas) - salidasTotales;

            const li = document.createElement('li');
            li.textContent = `${res.producto}: Entradas = ${res.entradas}, Salidas + Ventas = ${salidasTotales}, Stock = ${stock}`;
            resumenLista.appendChild(li);
        });
    }

        function exportarPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Título y Fecha
        doc.setFontSize(16);
        doc.text("Reporte de Inventario - Santo Sorbo", 14, 20);
        doc.setFontSize(10);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 28);

        // Preparar los datos para la tabla
        const headers = [["Fecha", "Tipo", "Producto", "Categoría", "Cantidad"]];
        const rows = [];

        document.querySelectorAll("#reportes-tbody tr").forEach(row => {
            const cols = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
            rows.push(cols);
        });

        // Generar tabla de movimientos
        doc.autoTable({
            head: headers,
            body: rows,
            startY: 35,
            theme: 'grid',
            headStyles: {
                fillColor: [44, 62, 80], // Azul oscuro
                textColor: 255,
                halign: 'center'
            },
            bodyStyles: {
                halign: 'center'
            },
            styles: {
                fontSize: 9
            }
        });

        // Resumen general al final
        let resumenY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.text("Resumen General", 14, resumenY);
        resumenY += 6;

        document.querySelectorAll("#resumen-lista li").forEach(li => {
            doc.setFontSize(10);
            doc.text(`• ${li.textContent}`, 16, resumenY);
            resumenY += 6;
        });

        // Guardar PDF
        doc.save('reporte_inventario.pdf');
    }


    document.getElementById('btn-filtrar').addEventListener('click', filtrarReportes);
    document.getElementById('btn-pdf').addEventListener('click', exportarPDF);

    document.getElementById('volverBtn')?.addEventListener('click', () => {
        if (rol === 'administrador') location.href = 'admin-dashboard.html';
        else if (rol === 'empleado') location.href = 'empleado-dashboard.html';
        else location.href = 'login.html';
    });

    cargarFiltros();
});




