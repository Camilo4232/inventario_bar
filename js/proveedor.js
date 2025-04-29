const rol = localStorage.getItem('rol');
if (!rol) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalProveedor');
    const form = document.getElementById('formProveedor');
    const btnAgregar = document.getElementById('agregarProveedorBtn');
    const btnCancelar = document.getElementById('cancelarProveedorBtn');
    const tbody = document.getElementById('proveedores-tbody');

    const proveedores = [];

    // Función para renderizar proveedores en la tabla
    function renderizarProveedores() {
        tbody.innerHTML = '';
        proveedores.forEach((prov, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${prov.nombre}</td>
                <td>${prov.telefono}</td>
                <td>${prov.email}</td>
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
                editarProveedor(index);
            });
        });

        document.querySelectorAll('.eliminar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                eliminarProveedor(index);
            });
        });
    }

    // Mostrar el modal para agregar nuevo proveedor
    btnAgregar.addEventListener('click', () => {
        modal.classList.add('activo');
        // Configurar el formulario para agregar
        form.onsubmit = (e) => {
            e.preventDefault();
            const nuevoProveedor = {
                nombre: form.nombre.value.trim(),
                telefono: form.telefono.value.trim(),
                email: form.email.value.trim()
            };
            proveedores.push(nuevoProveedor);
            renderizarProveedores();
            form.reset();
            modal.classList.remove('activo');
        };
    });

    // Cancelar la operación y cerrar el modal
    btnCancelar.addEventListener('click', () => {
        modal.classList.remove('activo');
        form.reset();
    });

    // Función para editar un proveedor
    function editarProveedor(index) {
        const proveedor = proveedores[index];
        form.nombre.value = proveedor.nombre;
        form.telefono.value = proveedor.telefono;
        form.email.value = proveedor.email;

        modal.classList.add('activo');

        // Configurar el formulario para editar
        form.onsubmit = (e) => {
            e.preventDefault();
            proveedor.nombre = form.nombre.value.trim();
            proveedor.telefono = form.telefono.value.trim();
            proveedor.email = form.email.value.trim();
            renderizarProveedores();
            form.reset();
            modal.classList.remove('activo');
            // Restaurar el comportamiento para agregar
            form.onsubmit = (e) => {
                e.preventDefault();
                const nuevoProveedor = {
                    nombre: form.nombre.value.trim(),
                    telefono: form.telefono.value.trim(),
                    email: form.email.value.trim()
                };
                proveedores.push(nuevoProveedor);
                renderizarProveedores();
                form.reset();
                modal.classList.remove('activo');
            };
        };
    }

    // Función para eliminar un proveedor
    function eliminarProveedor(index) {
        if (confirm('¿Estás seguro de eliminar este proveedor?')) {
            proveedores.splice(index, 1);
            renderizarProveedores();
        }
    }

    // Volver a la página principal
    document.getElementById('volverBtn').addEventListener('click', () => {
        window.location.href = rol === 'Administrador' ? 'admin-dashboard.html' : 'empleado-dashboard.html';
    });
});


   
