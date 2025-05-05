document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalMovimiento');
    const form = document.getElementById('formMovimiento');
    const btnAgregar = document.getElementById('agregarMovimientoBtn');
    const btnCancelar = document.getElementById('cancelarMovimientoBtn');
    const tbody = document.getElementById('movimientos-tbody');

    const cargarMovimientos = async () => {
        const res = await fetch('php2/listar_movimientos.php');
        const movimientos = await res.json();

        tbody.innerHTML = '';
        movimientos.forEach((mov, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${mov.producto}</td>
                <td>${mov.tipo}</td>
                <td>${mov.cantidad}</td>
                <td>${mov.fecha}</td>
            `;
            tbody.appendChild(tr);
        });
    };
    const cargarProductos = async () => {
        const res = await fetch('php2/listar_productos.php'); // ahora lo creamos
        const productos = await res.json();
        const select = document.getElementById('productoMovimiento');
        productos.forEach(prod => {
            const option = document.createElement('option');
            option.value = prod.nombre;
            option.textContent = prod.nombre;
            select.appendChild(option);
        });
    };
    

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const datos = new FormData(form);

        await fetch('php2/guardar_movimiento.php', {
            method: 'POST',
            body: datos
        });

        form.reset();
        modal.classList.remove('activo');
        cargarMovimientos();
    });

    btnAgregar.addEventListener('click', () => modal.classList.add('activo'));
    btnCancelar.addEventListener('click', () => {
        modal.classList.remove('activo');
        form.reset();
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

    
    cargarMovimientos();
    cargarProductos();
});


