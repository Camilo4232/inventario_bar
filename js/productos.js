// Productos de ejemplo
const productosEjemplo = [
    { id: 1, nombre: "Ron Añejo", descripcion: "Botella 750ml", cantidad: 20, proveedor: "Ron S.A.", estado: "Disponible" },
    { id: 2, nombre: "Cerveza Artesanal", descripcion: "Pack 6 botellas", cantidad: 15, proveedor: "Cervecería Bar", estado: "Disponible" },
    { id: 3, nombre: "Tequila", descripcion: "Botella 1L", cantidad: 8, proveedor: "Tequila MX", estado: "Bajo stock" },
    { id: 4, nombre: "Whisky", descripcion: "Botella 700ml", cantidad: 0, proveedor: "Whisky Import", estado: "Agotado" }
];

// Obtener el rol del usuario
const rol = localStorage.getItem('rol');

// Redirección si no hay sesión
if (!rol) {
    window.location.href = 'login.html';
}

// Inicializar el contador de ID en localStorage
if (!localStorage.getItem('productoIdCounter')) {
    localStorage.setItem('productoIdCounter', 4); 
}

// Mostrar/ocultar botones según el rol
function ajustarVisibilidadPorRol() {
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
        el.style.display = (rol === 'Administrador') ? '' : 'none';
    });
}

// Renderizar la tabla de productos
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
        `;
        tbody.appendChild(tr);
    });
}

// Botón volver
document.addEventListener('DOMContentLoaded', () => {
    ajustarVisibilidadPorRol();
    renderizarProductos();

    document.getElementById('volverBtn').addEventListener('click', () => {
        if (rol === 'Administrador') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'empleado-dashboard.html';
        }
    });

    // modal nuevo producto
const modal = document.getElementById('modalProducto');
const form = document.getElementById('formProducto');
const btnAgregar = document.getElementById('agregarProductoBtn');
const btnCancelar = document.getElementById('cancelarModalBtn');
const notificacion = document.getElementById('notificacion');

// Abrir modal
if (btnAgregar) {
    btnAgregar.addEventListener('click', () => {
        modal.classList.add('activo');
        modal.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
            document.getElementById('nombreProducto').focus();
        }, 100);
    });
}

// Cerrar modal con botón cancelar
btnCancelar.addEventListener('click', cerrarModal);

// Cerrar modal con tecla Esc
window.addEventListener('keydown', (e) => {
    if (modal.classList.contains('activo') && e.key === 'Escape') {
        cerrarModal();
    }
});

function cerrarModal() {
    form.reset();
    modal.classList.remove('activo');
    modal.setAttribute('aria-hidden', 'true');
}

// Guardar producto
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validación
    const nombre = form.nombre.value.trim();
    const descripcion = form.descripcion.value.trim();
    const proveedor = form.proveedor.value.trim();
    const cantidad = parseInt(form.cantidad.value, 10);
    const estado = form.estado.value;

    if (!nombre || !descripcion || !proveedor || !cantidad || cantidad < 1 || !estado) {
        mostrarNotificacion('Por favor, completa todos los campos correctamente.');
        return;
    }

    // Obtener el contador de ID y generar un nuevo ID
    let productoIdCounter = parseInt(localStorage.getItem('productoIdCounter'), 10);
    const id = productoIdCounter + 1; // Incrementar el ID
    localStorage.setItem('productoIdCounter', id); // Actualizar el contador en localStorage

    // Agregar producto a la tabla (y a la variable de productos)
    const nuevoProducto = { id, nombre, descripcion, cantidad, proveedor, estado };
    productosEjemplo.push(nuevoProducto);
    renderizarProductos();

    mostrarNotificacion('¡Producto guardado correctamente!');
    cerrarModal();
});

// Notificación flotante
function mostrarNotificacion(mensaje) {
    notificacion.textContent = mensaje;
    notificacion.style.display = 'block';
    setTimeout(() => {
        notificacion.style.display = 'none';
    }, 2000);
}

});