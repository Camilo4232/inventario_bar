document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalProveedor');
    const form = document.getElementById('formProveedor');
    const btnAgregar = document.getElementById('agregarProveedorBtn');
    const btnCancelar = document.getElementById('cancelarProveedorBtn');
    const tbody = document.getElementById('proveedores-tbody');
    

    let proveedores = [];
    let editando = false;
    let proveedorEditandoId = null;

    function cargarProveedores() {
        fetch('php/listar_proveedores.php')
            .then(response => response.json())
            .then(data => {
                proveedores = data;
                renderizarProveedores();
            })
            .catch(error => console.error('Error al cargar proveedores:', error));
    }

    function renderizarProveedores() {
        tbody.innerHTML = '';
        proveedores.forEach(prov => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${prov.id}</td>
                <td>${prov.nombre}</td>
                <td>${prov.telefono}</td>
                <td>${prov.email}</td>
                <td>
                    <button class="btn-amarillo editar-btn" data-id="${prov.id}">Editar</button>
                    <button class="btn-rojo eliminar-btn" data-id="${prov.id}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

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
                eliminarProveedor(id);
            });
        });
    }

    function editarProveedor(proveedor) {
        editando = true;
        proveedorEditandoId = proveedor.id;
        form.nombre.value = proveedor.nombre;
        form.telefono.value = proveedor.telefono;
        form.email.value = proveedor.email;
        modal.classList.add('activo');
    }

    function eliminarProveedor(id) {
        if (!confirm('¿Estás seguro de eliminar este proveedor?')) return;
        fetch('php/eliminar_proveedor.php', {
            method: 'POST',
            body: new URLSearchParams({ id })
        })
        .then(r => r.text())
        .then(res => {
            if (res.trim() === 'ok') cargarProveedores();
            else alert('Error al eliminar proveedor.');
        });
    }

    btnAgregar.addEventListener('click', () => {
        editando = false;
        proveedorEditandoId = null;
        form.reset();
        modal.classList.add('activo');
    });

    btnCancelar.addEventListener('click', () => {
        modal.classList.remove('activo');
        form.reset();
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const datos = new URLSearchParams({
            nombre: form.nombre.value.trim(),
            telefono: form.telefono.value.trim(),
            email: form.email.value.trim()
        });

        if (editando) {
            datos.append('id', proveedorEditandoId);
            fetch('php/editar_proveedor.php', {
                method: 'POST',
                body: datos
            })
            .then(r => r.text())
            .then(res => {
                if (res.trim() === 'ok') {
                    cargarProveedores();
                    modal.classList.remove('activo');
                    form.reset();
                } else {
                    alert('Error al editar proveedor.');
                }
            });
        } else {
            
            fetch('php/guardar_proveedor.php', {
                method: 'POST',
                body: datos
            })
            .then(r => r.text())   
            .then(res => {
                console.log('Respuesta del servidor:', `"${res}"`);
                if (res.trim() === 'ok') {
                    cargarProveedores();
                    modal.classList.remove('activo');
                    form.reset();
                } else {
                    alert('Error al guardar proveedor.');
                }
            });
                  
        }
    });

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
        cargarProveedores();
    });


