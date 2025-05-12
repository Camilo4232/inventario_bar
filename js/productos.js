document.addEventListener('DOMContentLoaded', () => {
    const proveedorSelect = document.getElementById('proveedorProducto');
    const agregarProductoBtn = document.getElementById('agregarProductoBtn');
    const modalProducto = document.getElementById('modalProducto');
    const cancelarModalBtn = document.getElementById('cancelarModalBtn');
    const formProducto = document.getElementById('formProducto');
    const lista = document.getElementById('listaProductos');

    // Cargar proveedores en el combo box
    function cargarProveedores() {
        fetch('listar_proveedores.php')
            .then(response => response.json())
            .then(proveedores => {
                proveedorSelect.innerHTML = '<option value="">Selecciona proveedor</option>';
                proveedores.forEach(proveedor => {
                    const option = document.createElement('option');
                    option.value = proveedor.id;
                    option.textContent = proveedor.nombre;
                    proveedorSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error al cargar proveedores:', error));
    }

    // Abrir modal para agregar producto
    function abrirModal() {
        modalProducto.style.display = 'block';
        formProducto.reset();
        cargarProveedores();
        const idInput = document.getElementById('productoId');
        if (idInput) idInput.remove();
    }

    // Cargar productos desde la base de datos
    function cargarProductos() {
        fetch('listar_productos.php')
            .then(response => response.json())
            .then(productos => {
                lista.innerHTML = '';
                const formatoPrecio = new Intl.NumberFormat('es-CO', {
                    style: 'decimal',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });

                productos.forEach(producto => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${producto.nombre}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.proveedor_nombre}</td>
                        <td>${producto.estado}</td>
                        <td>${formatoPrecio.format(producto.precio)}</td>
                        <td>
                            <button class="btn-editar" data-id="${producto.id}">Editar</button>
                            <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
                        </td>
                    `;
                    lista.appendChild(tr);
                });
            })
            .catch(error => console.error('Error al cargar productos:', error));
    }

    // Obtener datos de producto y abrir modal para editar
    function editarProducto(id) {
        fetch(`editar_producto.php?id=${id}`)
            .then(response => response.json())
            .then(producto => {
                document.getElementById('nombreProducto').value = producto.nombre;
                document.getElementById('descripcionProducto').value = producto.descripcion;
                document.getElementById('estadoProducto').value = producto.estado;
                document.getElementById('proveedorProducto').value = producto.proveedor;

                const formatoPrecio = new Intl.NumberFormat('es-CO', {
                    style: 'decimal',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
                document.getElementById('precioProducto').value = formatoPrecio.format(producto.precio);

                let inputId = document.getElementById('productoId');
                if (!inputId) {
                    inputId = document.createElement('input');
                    inputId.type = 'hidden';
                    inputId.id = 'productoId';
                    inputId.name = 'id';
                    formProducto.appendChild(inputId);
                }
                inputId.value = producto.id;

                modalProducto.style.display = 'block';
            });
    }

    // Eliminar producto
    function eliminarProducto(id) {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            fetch('eliminar_producto.php', {
                method: 'POST',
                body: new URLSearchParams({ id })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Producto eliminado correctamente");
                    cargarProductos();
                } else {
                    alert("Error al eliminar el producto");
                }
            });
        }
    }

    // Manejar clicks de editar/eliminar (solo se asigna una vez)
    lista.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-editar')) {
            const id = event.target.getAttribute('data-id');
            editarProducto(id);
        }
        if (event.target.classList.contains('btn-eliminar')) {
            const id = event.target.getAttribute('data-id');
            eliminarProducto(id);
        }
    });

    // Guardar producto
    formProducto.addEventListener('submit', (event) => {
        event.preventDefault();

        const proveedorSeleccionado = proveedorSelect.value;
        if (!proveedorSeleccionado) {
            alert('Por favor selecciona un proveedor');
            return;
        }

        const precioInput = document.getElementById('precioProducto').value;
        const precioLimpio = parseFloat(precioInput.replace(/\./g, '').replace(',', '.'));

        if (isNaN(precioLimpio)) {
            alert('El precio ingresado no es válido');
            return;
        }

        const formData = new FormData(formProducto);
        formData.set('proveedor', proveedorSeleccionado);
        formData.set('precio', precioLimpio);

        const url = formData.has('id') ? 'actualizar_producto.php' : 'guardar_producto.php';

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Producto guardado correctamente');
                cargarProductos();
                modalProducto.style.display = 'none';
            } else {
                alert('Error al guardar el producto');
            }
        })
        .catch(error => console.error('Error:', error));
    });

    cancelarModalBtn.addEventListener('click', () => {
        modalProducto.style.display = 'none';
    });

    // Inicialización
    if (agregarProductoBtn) {
        agregarProductoBtn.addEventListener('click', abrirModal);
    }

    cargarProveedores();
    cargarProductos();
});
