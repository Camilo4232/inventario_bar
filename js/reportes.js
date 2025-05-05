const rol = localStorage.getItem('rol');
if (!rol) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('reportes-tbody');

    async function cargarReportes() {
        try {
            const res = await fetch('php2/listar_inventario.php');
            const datos = await res.json();
            
            console.log("Datos recibidos:", datos); // Verifica los datos recibidos
    
            if (datos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3">No hay datos disponibles.</td></tr>';
                return;
            }
    
            // Depura lo que se está agregando al DOM
            tbody.innerHTML = '';
            datos.forEach((item) => {
                console.log("Renderizando producto:", item); // Verifica cada item
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.producto}</td>
                    <td>${item.stock}</td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error al cargar reportes:', error);
            tbody.innerHTML = '<tr><td colspan="3">Error al cargar los datos.</td></tr>';
        }
    }

    const volverBtn = document.getElementById('volverBtn');
    volverBtn.addEventListener('click', () => {
    const rol = localStorage.getItem('rol');
    if (rol === 'administrador') {
        window.location.href = 'admin-dashboard.html';
    } else if (rol === 'empleado') {
        window.location.href = 'empleado-dashboard.html';
    } else {
        window.location.href = 'login.html';
    }
    });

    cargarReportes();
});


