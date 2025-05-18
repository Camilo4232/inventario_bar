document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalProveedor');
    const form = document.getElementById('formProveedor');
    const btnAgregar = document.getElementById('agregarProveedorBtn');
    const btnCancelar = document.getElementById('cancelarProveedorBtn');
    const tbody = document.getElementById('proveedores-tbody');
    const modalTitulo = document.querySelector('.modal-titulo');
    
    let proveedores = [];
    let editando = false;
    let proveedorEditandoId = null;

    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje, tipo = 'exito') {
        // Crear el elemento de notificación si no existe
        let notificacion = document.querySelector('.notificacion');
        if (!notificacion) {
            notificacion = document.createElement('div');
            notificacion.className = 'notificacion';
            document.body.appendChild(notificacion);
        }
        
        // Configurar la notificación
        notificacion.textContent = mensaje;
        notificacion.className = `notificacion ${tipo}`;
        
        // Mostrar y ocultar después de un tiempo
        setTimeout(() => notificacion.classList.add('mostrar'), 10);
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
            setTimeout(() => notificacion.remove(), 500);
        }, 3000);
    }

    // Función para mostrar confirmación de eliminación
    function mostrarConfirmacion(mensaje, callback) {
        // Crear el modal de confirmación
        const confirmacionOverlay = document.createElement('div');
        confirmacionOverlay.className = 'modal-producto activo';
        confirmacionOverlay.style.zIndex = '2000';
        
        const confirmacionContenido = document.createElement('div');
        confirmacionContenido.className = 'modal-contenido';
        confirmacionContenido.style.width = '320px';
        confirmacionContenido.style.background = 'rgba(255, 255, 255, 0.9)';
        confirmacionContenido.style.borderRadius = '12px';
        confirmacionContenido.style.backdropFilter = 'blur(10px)';
        
        confirmacionContenido.innerHTML = `
            <p style="text-align: center; margin: 20px 0; font-weight: 500;">${mensaje}</p>
            <div class="modal-botones" style="justify-content: center;">
                <button class="btn-amarillo" id="btnConfirmarSi">Aceptar</button>
                <button class="btn-gris" id="btnConfirmarNo">Cancelar</button>
            </div>
        `;
        
        confirmacionOverlay.appendChild(confirmacionContenido);
        document.body.appendChild(confirmacionOverlay);
        
        // Manejar los botones
        document.getElementById('btnConfirmarSi').addEventListener('click', () => {
            confirmacionOverlay.remove();
            callback(true);
        });
        
        document.getElementById('btnConfirmarNo').addEventListener('click', () => {
            confirmacionOverlay.remove();
            callback(false);
        });
    }

    function cargarProveedores() {
        fetch('php/listar_proveedores.php')
            .then(response => response.json())
            .then(data => {
                proveedores = data;
                renderizarProveedores();
            })
            .catch(error => {
                console.error('Error al cargar proveedores:', error);
                mostrarNotificacion('Error al cargar los proveedores', 'error');
            });
    }

    function renderizarProveedores() {
        tbody.innerHTML = '';
        
        if (proveedores.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="5" style="text-align: center;">No hay proveedores registrados</td>';
            tbody.appendChild(tr);
            return;
        }
        
        proveedores.forEach(prov => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${prov.id}</td>
                <td>${prov.nombre}</td>
                <td>${prov.telefono}</td>
                <td>${prov.email}</td>
                <td>
                    <button class="btn-amarillo btn-sm editar-btn" data-id="${prov.id}">Editar</button>
                    <button class="btn-rojo btn-sm eliminar-btn" data-id="${prov.id}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Agregar event listeners a los botones
        document.querySelectorAll('.editar-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const id = e.target.dataset.id;
                const proveedor = proveedores.find(p => p.id === id);
                if (proveedor) editarProveedor(proveedor);
            });
        });

        document.querySelectorAll('.eliminar-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const id = e.target.dataset.id;
                const proveedor = proveedores.find(p => p.id === id);
                if (proveedor) eliminarProveedor(proveedor);
            });
        });
    }

    function editarProveedor(proveedor) {
        editando = true;
        proveedorEditandoId = proveedor.id;
        modalTitulo.textContent = 'Editar Proveedor';
        form.nombre.value = proveedor.nombre;
        form.telefono.value = proveedor.telefono;
        form.email.value = proveedor.email;
        modal.classList.add('activo');
    }

    function eliminarProveedor(proveedor) {
        mostrarConfirmacion(
            '¿Estás seguro de eliminar este proveedor?', 
            (confirmado) => {
                if (!confirmado) return;
                
                fetch('php/eliminar_proveedor.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({ id: proveedor.id })
                })
                .then(response => response.text())
                .then(res => {
                    if (res.trim() === 'ok') {
                        mostrarNotificacion(`Proveedor "${proveedor.nombre}" eliminado correctamente`, 'exito');
                        cargarProveedores();
                    } else {
                        mostrarNotificacion('Error al eliminar proveedor', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    mostrarNotificacion('Error de conexión', 'error');
                });
            }
        );
    }

    btnAgregar.addEventListener('click', () => {
        editando = false;
        proveedorEditandoId = null;
        modalTitulo.textContent = 'Registrar Proveedor';
        form.reset();
        modal.classList.add('activo');
    });

    btnCancelar.addEventListener('click', () => {
        modal.classList.remove('activo');
        form.reset();
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        
        // Validación básica
        const nombre = form.nombre.value.trim();
        const telefono = form.telefono.value.trim();
        const email = form.email.value.trim();
        
        if (!nombre || !telefono || !email) {
            mostrarNotificacion('Todos los campos son obligatorios', 'advertencia');
            return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarNotificacion('El formato del email no es válido', 'advertencia');
            return;
        }

        const datos = new URLSearchParams({
            nombre: nombre,
            telefono: telefono,
            email: email
        });

        if (editando) {
            datos.append('id', proveedorEditandoId);
            fetch('php/editar_proveedor.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: datos
            })
            .then(response => response.text())
            .then(res => {
                if (res.trim() === 'ok') {
                    mostrarNotificacion(`Proveedor "${nombre}" actualizado correctamente`, 'exito');
                    cargarProveedores();
                    modal.classList.remove('activo');
                    form.reset();
                } else {
                    mostrarNotificacion('Error al editar proveedor', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarNotificacion('Error de conexión', 'error');
            });
        } else {
            fetch('php/guardar_proveedor.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: datos
            })
            .then(response => response.text())
            .then(res => {
                console.log('Respuesta del servidor:', `"${res}"`);
                if (res.trim() === 'ok') {
                    mostrarNotificacion(`Proveedor "${nombre}" guardado correctamente`, 'exito');
                    cargarProveedores();
                    modal.classList.remove('activo');
                    form.reset();
                } else {
                    mostrarNotificacion('Error al guardar proveedor', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarNotificacion('Error de conexión', 'error');
            });
        }
    });

    // Botón para volver al dashboard según el rol
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

    // Verificar permisos según el rol
    function verificarPermisos() {
        const rol = localStorage.getItem('rol');
        const elementosAdmin = document.querySelectorAll('.admin-only');
        
        if (rol !== 'administrador') {
            elementosAdmin.forEach(el => {
                el.style.display = 'none';
            });
            
            // Ocultar botones de acción para no administradores
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('editar-btn') || 
                    e.target.classList.contains('eliminar-btn')) {
                    if (rol !== 'administrador') {
                        e.preventDefault();
                        mostrarNotificacion('No tienes permisos para esta acción', 'advertencia');
                    }
                }
            }, true);
        }
    }

    // Inicialización
    cargarProveedores();
    verificarPermisos();
});


