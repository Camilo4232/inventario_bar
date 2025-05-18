
document.addEventListener('DOMContentLoaded', () => {
    const proveedorSelect = document.getElementById('proveedorProducto');
    const categoriaSelect = document.getElementById('categoriaProducto');
    const filtroCategoriaSelect = document.getElementById('filtroCategoria');
    const agregarProductoBtn = document.getElementById('agregarProductoBtn');
    const modalProducto = document.getElementById('modalProducto');
    const cancelarModalBtn = document.getElementById('cancelarModalBtn');
    const formProducto = document.getElementById('formProducto');
    const lista = document.getElementById('listaProductos');
    
    // Obtener el rol del usuario actual
    const rol = localStorage.getItem('rol');
    console.log('Iniciando sistema con rol:', rol);

    // Verificar que el elemento lista existe
    if (!lista) {
        console.error('ERROR CRÍTICO: El elemento con id "listaProductos" no se encontró en el DOM');
        mostrarNotificacion('Error: No se encontró la tabla de productos. Contacte al administrador del sistema.', 'error');
        return;
    }
    
    // Desactivar botón de guardar para empleados
    if (rol === 'empleado') {
        const btnGuardar = document.getElementById('btn-guardar');
        if (btnGuardar) {
            btnGuardar.disabled = true;
            console.log('Botón de guardar desactivado para rol empleado');
        } else {
            console.log('No se encontró el botón de guardar (id: btn-guardar)');
        }
    }
    
    // Variable para mantener el filtro de categoría actual
    let filtroCategoriaActual = '';

    // Función para mostrar notificaciones con SweetAlert2
    function mostrarNotificacion(mensaje, tipo = 'success') {
        Swal.fire({
            title: tipo === 'success' ? 'Éxito' : tipo === 'error' ? 'Error' : 'Atención',
            text: mensaje,
            icon: tipo, // 'success', 'error', 'warning', 'info'
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#ffc107',
            background: 'rgba(30, 30, 30, 0.95)',
            color: '#fff',
            backdrop: `rgba(0,0,0,0.4)`,
            showClass: {
                popup: 'animate__animated animate__fadeIn faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOut faster'
            }
        });
    }

    // Función para mostrar diálogos de confirmación
    function confirmarAccion(titulo, mensaje, callback) {
        Swal.fire({
            title: titulo,
            text: mensaje,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6c757d',
            background: 'rgba(30, 30, 30, 0.95)',
            color: '#fff',
            backdrop: `rgba(0,0,0,0.4)`
        }).then((result) => {
            if (result.isConfirmed) {
                callback();
            }
        });
    }

    function cargarProveedores() {
        fetch('listar_proveedores.php')
            .then(response => response.json())
            .then(proveedores => {
                proveedorSelect.innerHTML = '<option value="">Selecciona proveedor</option>';
                proveedores.forEach(p => {
                    const option = document.createElement('option');
                    option.value = p.id;
                    option.textContent = p.nombre;
                    proveedorSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar proveedores:', error);
                mostrarNotificacion('No se pudieron cargar los proveedores', 'error');
            });
    }

    function cargarCategorias() {
        fetch('php4/obtener_categorias.php')
            .then(response => response.json())
            .then(categorias => {
                categoriaSelect.innerHTML = '<option value="">Selecciona categoría</option>';
                filtroCategoriaSelect.innerHTML = '<option value="">Todas las categorías</option>';

                categorias.forEach(c => {
                    const option = document.createElement('option');
                    option.value = c.id;
                    option.textContent = c.nombre;
                    categoriaSelect.appendChild(option);

                    const filtroOption = document.createElement('option');
                    filtroOption.value = c.id;
                    filtroOption.textContent = c.nombre;
                    filtroCategoriaSelect.appendChild(filtroOption);
                });

                const nuevaOption = document.createElement('option');
                nuevaOption.value = 'nueva';
                nuevaOption.textContent = 'Agregar nueva categoría';
                categoriaSelect.appendChild(nuevaOption);
            })
            .catch(error => {
                console.error('Error cargando categorías:', error);
                mostrarNotificacion('No se pudieron cargar las categorías', 'error');
            });
    }

    categoriaSelect.addEventListener('change', () => {
        if (categoriaSelect.value === 'nueva') {
            Swal.fire({
                title: 'Nueva Categoría',
                input: 'text',
                inputLabel: 'Nombre de la categoría',
                inputPlaceholder: 'Ingrese el nombre de la categoría',
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#4ade80',
                cancelButtonColor: '#6c757d',
                background: 'rgba(30, 30, 30, 0.95)',
                color: '#fff',
                backdrop: `rgba(0,0,0,0.4)`
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    fetch('php4/agregar_categoria.php', {
                        method: 'POST',
                        body: new URLSearchParams({ nombre: result.value })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            mostrarNotificacion('Categoría agregada correctamente');
                            cargarCategorias();
                        } else {
                            mostrarNotificacion('Error al agregar categoría', 'error');
                        }
                    });
                } else {
                    // Resetear la selección si se cancela
                    categoriaSelect.value = "";
                }
            });
        }
    });

    filtroCategoriaSelect.addEventListener('change', () => {
        filtroCategoriaActual = filtroCategoriaSelect.value;
        cargarProductos(filtroCategoriaActual);
    });

    function cargarProductos(categoria = '') {
        let url = 'listar_productos.php';
        if (categoria) url += `?categoria=${categoria}`;

        // Agregar mensaje de carga a la tabla
        lista.innerHTML = '<tr><td colspan="6" style="text-align: center;">Cargando productos...</td></tr>';

        console.log(`Rol actual: ${rol}`);
        console.log(`Cargando productos desde: ${url}`);

        fetch(url)
            .then(response => {
                console.log('Respuesta recibida del servidor');
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(productos => {
                console.log(`Se encontraron ${productos.length} productos:`, productos);
                lista.innerHTML = '';
                
                if (productos.length === 0) {
                    lista.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay productos disponibles</td></tr>';
                    return;
                }

                const formato = new Intl.NumberFormat('es-CO', { style: 'decimal', minimumFractionDigits: 0 });

                productos.forEach(p => {
                    const tr = document.createElement('tr');
                    
                    // Crear las celdas con la información del producto
                    tr.innerHTML = `
                        <td>${p.nombre || 'Sin nombre'}</td>
                        <td>${p.categoria_nombre || 'Sin categoría'}</td>
                        <td>${p.proveedor_nombre || 'Sin proveedor'}</td>
                        <td>${p.estado || 'Sin estado'}</td>
                        <td>${formato.format(p.precio || 0)}</td>
                    `;
                    
                    // Crear la celda de acciones dependiendo del rol
                    const tdAcciones = document.createElement('td');
                    if (rol === 'administrador') {
                        const btnEditar = document.createElement('button');
                        btnEditar.textContent = 'Editar';
                        btnEditar.className = 'btn-editar';
                        btnEditar.dataset.id = p.id;

                        const btnEliminar = document.createElement('button');
                        btnEliminar.textContent = 'Eliminar';
                        btnEliminar.className = 'btn-eliminar';
                        btnEliminar.dataset.id = p.id;

                        tdAcciones.appendChild(btnEditar);
                        tdAcciones.appendChild(btnEliminar);
                    } else {
                        tdAcciones.textContent = 'Sin permisos';
                    }
                    
                    // Añadir la celda de acciones a la fila
                    tr.appendChild(tdAcciones);
                    
                    // Añadir la fila a la tabla
                    lista.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error cargando productos:', error);
                lista.innerHTML = `<tr><td colspan="6" style="text-align: center;">Error al cargar productos: ${error.message}</td></tr>`;
                mostrarNotificacion('No se pudieron cargar los productos', 'error');
            });
    }

    function abrirModal() {
        modalProducto.style.display = 'block';
        formProducto.reset();
        cargarProveedores();
        cargarCategorias();

        const idInput = document.getElementById('productoId');
        if (idInput) idInput.remove();
    }

    function editarProducto(id) {
        fetch(`editar_producto.php?id=${id}`)
            .then(response => response.json())
            .then(p => {
                document.getElementById('nombreProducto').value = p.nombre;
                document.getElementById('categoriaProducto').value = p.id_categoria;
                document.getElementById('proveedorProducto').value = p.proveedor;
                document.getElementById('estadoProducto').value = p.estado;
                document.getElementById('precioProducto').value = p.precio;

                let inputId = document.getElementById('productoId');
                if (!inputId) {
                    inputId = document.createElement('input');
                    inputId.type = 'hidden';
                    inputId.id = 'productoId';
                    inputId.name = 'id';
                    formProducto.appendChild(inputId);
                }
                inputId.value = p.id;

                modalProducto.style.display = 'block';
            })
            .catch(error => {
                console.error('Error al cargar datos del producto:', error);
                mostrarNotificacion('Error al cargar datos del producto', 'error');
            });
    }

    function eliminarProducto(id) {
        confirmarAccion('¿Eliminar este producto?', '¿Estás seguro que deseas eliminar este producto?', () => {
            fetch('eliminar_producto.php', {
                method: 'POST',
                body: new URLSearchParams({ id })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    mostrarNotificacion('Producto eliminado correctamente');
                    cargarProductos(filtroCategoriaActual);
                } else {
                    mostrarNotificacion(data.message || 'No se puede eliminar el producto porque ya ha sido usado en una venta.', 'error');
                }
            })
            .catch(error => {
                console.error('Error al eliminar el producto:', error);
                mostrarNotificacion('Error al eliminar el producto', 'error');
            });
        });
    }

    lista.addEventListener('click', e => {
        if (e.target.classList.contains('btn-editar')) editarProducto(e.target.dataset.id);
        if (e.target.classList.contains('btn-eliminar')) eliminarProducto(e.target.dataset.id);
    });

    formProducto.addEventListener('submit', e => {
        e.preventDefault();

        if (!proveedorSelect.value || !categoriaSelect.value) {
            mostrarNotificacion('Por favor, selecciona proveedor y categoría', 'warning');
            return;
        }

        const precio = parseFloat(document.getElementById('precioProducto').value);
        if (isNaN(precio)) {
            mostrarNotificacion('El precio ingresado no es válido', 'warning');
            return;
        }

        const formData = new FormData(formProducto);
        formData.set('precio', precio);

        const url = document.getElementById('productoId') ? 'actualizar_producto.php' : 'guardar_producto.php';

        fetch(url, { method: 'POST', body: formData })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    mostrarNotificacion('Producto guardado correctamente');
                    modalProducto.style.display = 'none';
                    cargarProductos(filtroCategoriaActual);
                } else {
                    mostrarNotificacion('Error al guardar el producto', 'error');
                }
            })
            .catch(error => {
                console.error('Error al guardar el producto:', error);
                mostrarNotificacion('Error al guardar el producto', 'error');
            });
    });

    cancelarModalBtn.addEventListener('click', () => modalProducto.style.display = 'none');
    if (agregarProductoBtn) agregarProductoBtn.addEventListener('click', abrirModal);

    // Inicialización
    cargarProveedores();
    cargarCategorias();
    cargarProductos(); // carga inicial sin filtro
});


