// Protección de ruta y bienvenida personalizada
(function() {
    const usuario = localStorage.getItem('usuario');
    const rol = localStorage.getItem('rol');
    const isAdmin = document.body.classList.contains('admin-dashboard');
    const isEmpleado = document.body.classList.contains('empleado-dashboard');

    // Redirección si no hay sesión válida
    if (!usuario || (!isAdmin && !isEmpleado) ||
        (isAdmin && rol !== 'Administrador') ||
        (isEmpleado && rol !== 'Empleado')) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar nombre y fecha
    const nombre = usuario;
    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });

    document.getElementById('user-name').textContent = nombre;
    document.getElementById('login-date').textContent = fechaFormateada;

    // Cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
})();