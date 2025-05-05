// Protección de ruta y bienvenida personalizada
document.addEventListener('DOMContentLoaded', () => {
    const usuario = localStorage.getItem('usuario');
    const rol = localStorage.getItem('rol')?.toLowerCase();
    const isAdmin = document.body.classList.contains('admin-dashboard');
    const isEmpleado = document.body.classList.contains('empleado-dashboard');

    if (!usuario || (!isAdmin && !isEmpleado) ||
        (isAdmin && rol !== 'administrador') ||
        (isEmpleado && rol !== 'empleado')) {
        console.warn('Redirigiendo por sesión inválida');
        window.location.href = 'login.html';
        return;
    }

    // Mostrar nombre de usuario y fecha
    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });

    document.getElementById('user-name').textContent = usuario;
    document.getElementById('login-date').textContent = fechaFormateada;

    // Redirección a los módulos
    document.getElementById('btn-producto').addEventListener('click', () => {
        window.location.href = 'productos.html';
    });

    document.getElementById('btn-entradas-salidas').addEventListener('click', () => {
        window.location.href = 'entradas_salidas.html';
    });

    document.getElementById('btn-proveedor').addEventListener('click', () => {
        window.location.href = 'proveedor.html';
    });

    document.getElementById('btn-reportes').addEventListener('click', () => {
        window.location.href = 'reportes.html';
    });

    // Cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
});


