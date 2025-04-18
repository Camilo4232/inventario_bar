document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
                // Aquí se haría la petición al backend para autenticar
                // Por ahora, solo simula un login exitoso
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const users = [
                { username: 'admin', password: 'admin123', rol: 'Administrador', redirect: 'admin-dashboard.html' },
                { username: 'empleado', password: 'empleado123', rol: 'Empleado', redirect: 'empleado-dashboard.html' }
            ];

            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // Guardar en localStorage
                localStorage.setItem('usuario', user.username);
                localStorage.setItem('rol', user.rol);
                window.location.href = user.redirect;
            } else {
                document.getElementById('loginError').textContent = 'Usuario o contraseña incorrectos';
            }
        });
    }

    //navegacion entre secciones
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
            const section = btn.getAttribute('data-section');
            document.getElementById(section + 'Section').style.display = 'block';
        });
    });

    //logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
});