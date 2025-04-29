// Obtener el rol del usuario
const rol = localStorage.getItem('rol');

// Redirección si no hay sesión
if (!rol) {
    window.location.href = 'login.html';
}

// Variables globales
let modoEdicion = false;
let idProductoEditando = null;

// Obtener los productos desde localStorage o usar los productos de ejemplo
let productosEjemplo = JSON.parse(localStorage.getItem('productos')) || [
    { id: 1, nombre: "Ron Añejo", descripcion: "Botella 750ml", cantidad: 20, proveedor: "Ron S.A.", estado: "Disponible" },
    { id: 2, nombre: "Cerveza Artesanal", descripcion: "Pack 6 botellas", cantidad: 15, proveedor: "Cervecería Bar", estado: "Disponible" },
    { id: 3, nombre: "Tequila", descripcion: "Botella 1L", cantidad: 8, proveedor: "Tequila MX", estado: "Bajo stock" },
    { id: 4, nombre: "Whisky", descripcion: "Botella 700ml", cantidad: 0, proveedor: "Whisky Import", estado: "Agotado" }
];

// Inicializar contador de ID si no existe
if (!localStorage.getItem('productoIdCounter')) {
    localStorage.setItem('productoIdCounter', 4);
}

document.addEventListener('DOMContentLoaded', () => {
    ajustarVisibilidadPorRol();
    renderizarProductos();

    const modal = document.getElementById('modalProducto');
    const form = document.getElementById('formProducto');
    const btnAgregar = document.getElementById('agregarProductoBtn');
    const btnCancelar = document.getElementById('cancelarModalBtn');
    const notificacion = document.getElementById('notificacion');

    // Botón volver
    document.getElementById('volverBtn').addEventListener('click', () => {
        if (rol === 'Administrador') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'empleado-dashboard.html';
        }
    });

    // Abrir modal
    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            modoEdicion = false;
            form.reset();
            abrirModal();
        });
    }

    // Cerrar modal
    btnCancelar.addEventListener('click', cerrarModal);

    // Cerrar modal con tecla Esc
    window.addEventListener('keydown', (e) => {
        if (modal.classList.contains('activo') && e.key === 'Escape') {
            cerrarModal();
        }
    });

    // Guardar producto (nuevo o editado)
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = form.nombre.value.trim();
        const descripcion = form.descripcion.value.trim();
        const proveedor = form.proveedor.value.trim();
        const cantidad = parseInt(form.cantidad.value, 10);
        const estado = form.estado.value;

        if (!nombre || !descripcion || !proveedor || isNaN(cantidad) || cantidad < 1 || !estado) {
            mostrarNotificacion('Por favor, completa todos los campos correctamente.');
            return;
        }

        if (modoEdicion) {
            // Editar producto existente
            const producto = productosEjemplo.find(p => p.id === idProductoEditando);
            if (producto) {
                producto.nombre = nombre;
                producto.descripcion = descripcion;
                producto.cantidad = cantidad;
                producto.proveedor = proveedor;
                producto.estado = estado;
                mostrarNotificacion('¡Producto editado correctamente!');
            }
        } else {
            // Agregar nuevo producto
            let productoIdCounter = parseInt(localStorage.getItem('productoIdCounter'), 10);
            const id = productoIdCounter + 1;
            localStorage.setItem('productoIdCounter', id);

            const nuevoProducto = { id, nombre, descripcion, cantidad, proveedor, estado };
            productosEjemplo.push(nuevoProducto);
            mostrarNotificacion('¡Producto guardado correctamente!');
        }

        guardarProductos();
        renderizarProductos();
        cerrarModal();
    });

    // Funciones internas

    function abrirModal() {
        modal.classList.add('activo');
        modal.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
            document.getElementById('nombreProducto').focus();
        }, 100);
    }

    function cerrarModal() {
        form.reset();
        modal.classList.remove('activo');
        modal.setAttribute('aria-hidden', 'true');
        modoEdicion = false;
        idProductoEditando = null;
    }

    function mostrarNotificacion(mensaje) {
        notificacion.textContent = mensaje;
        notificacion.style.display = 'block';
        setTimeout(() => {
            notificacion.style.display = 'none';
        }, 2000);
    }

    function ajustarVisibilidadPorRol() {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => {
            el.style.display = (rol === 'Administrador') ? '' : 'none';
        });
    }

    function renderizarProductos() {
        const tbody = document.getElementById('productos-tbody');
        tbody.innerHTML = '';

        productosEjemplo.forEach(producto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.proveedor}</td>
                <td>${producto.estado}</td>
                <td>
                    <button class="editarBtn admin-only" data-id="${producto.id}" style="background-color: yellow;">Editar</button>
                    <button class="eliminarBtn admin-only" data-id="${producto.id}" style="background-color: red; color: white;">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.editarBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                prepararEdicion(id);
            });
        });

        document.querySelectorAll('.eliminarBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                eliminarProducto(id);
            });
        });

        ajustarVisibilidadPorRol();
    }

    function prepararEdicion(id) {
        const producto = productosEjemplo.find(p => p.id === id);
        if (producto) {
            form.nombre.value = producto.nombre;
            form.descripcion.value = producto.descripcion;
            form.cantidad.value = producto.cantidad;
            form.proveedor.value = producto.proveedor;
            form.estado.value = producto.estado;

            modoEdicion = true;
            idProductoEditando = id;
            abrirModal();
        }
    }

    function eliminarProducto(id) {
        productosEjemplo = productosEjemplo.filter(producto => producto.id !== id);
        guardarProductos();
        renderizarProductos();
        mostrarNotificacion('Producto eliminado correctamente');
    }

    function guardarProductos() {
        localStorage.setItem('productos', JSON.stringify(productosEjemplo));
    }

});



