const rol = localStorage.getItem('rol');
if (!rol) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalMovimiento');
    const form = document.getElementById('formMovimiento');
    const btnAgregar = document.getElementById('agregarMovimientoBtn');
    const btnCancelar = document.getElementById('cancelarMovimientoBtn');
    const tbody = document.getElementById('movimientos-tbody');

    const movimientos = [];

    // Función para renderizar movimientos en la tabla
    function renderizarMovimientos() {
        tbody.innerHTML = '';
        movimientos.forEach((mov, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${mov.producto}</td>
                <td>${mov.tipo}</td>
                <td>${mov.cantidad}</td>
                <td>${mov.fecha}</td>
                <td>
                    <button class="btn-amarillo editar-btn" data-index="${index}">Editar</button>
                    <button class="btn-rojo eliminar-btn" data-index="${index}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Agregar eventos para los botones de editar y eliminar
        document.querySelectorAll('.editar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                editarMovimiento(index);
            });
        });

        document.querySelectorAll('.eliminar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                eliminarMovimiento(index);
            });
        });
    }

    // Mostrar el modal para agregar nuevo movimiento
    btnAgregar.addEventListener('click', () => {
        modal.classList.add('activo');
        // Configurar el formulario para agregar
        form.onsubmit = (e) => {
            e.preventDefault();
            const nuevoMov = {
                producto: form.producto.value.trim(),
                tipo: form.tipo.value,
                cantidad: form.cantidad.value,
                fecha: new Date().toLocaleDateString('es-ES')
            };
            movimientos.push(nuevoMov);
            renderizarMovimientos();
            form.reset();
            modal.classList.remove('activo');
        };
    });

    // Cancelar la operación y cerrar el modal
    btnCancelar.addEventListener('click', () => {
        modal.classList.remove('activo');
        form.reset();
    });

    // Función para editar un movimiento
    function editarMovimiento(index) {
        const movimiento = movimientos[index];
        form.producto.value = movimiento.producto;
        form.tipo.value = movimiento.tipo;
        form.cantidad.value = movimiento.cantidad;

        modal.classList.add('activo');

        // Configurar el formulario para editar
        form.onsubmit = (e) => {
            e.preventDefault();
            movimiento.producto = form.producto.value.trim();
            movimiento.tipo = form.tipo.value;
            movimiento.cantidad = form.cantidad.value;
            movimiento.fecha = new Date().toLocaleDateString('es-ES');
            renderizarMovimientos();
            form.reset();
            modal.classList.remove('activo');
            // Restaurar el comportamiento para agregar
            form.onsubmit = (e) => {
                e.preventDefault();
                const nuevoMov = {
                    producto: form.producto.value.trim(),
                    tipo: form.tipo.value,
                    cantidad: form.cantidad.value,
                    fecha: new Date().toLocaleDateString('es-ES')
                };
                movimientos.push(nuevoMov);
                renderizarMovimientos();
                form.reset();
                modal.classList.remove('activo');
            };
        };
    }

    // Función para eliminar un movimiento
    function eliminarMovimiento(index) {
        if (confirm('¿Estás seguro de eliminar este movimiento?')) {
            movimientos.splice(index, 1);
            renderizarMovimientos();
        }
    }
        // Volver a la página principal
        document.getElementById('volverBtn').addEventListener('click', () => {
            window.location.href = rol === 'Administrador' ? 'admin-dashboard.html' : 'empleado-dashboard.html';
        });
});

