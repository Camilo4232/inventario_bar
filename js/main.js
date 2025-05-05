document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const formData = new URLSearchParams();
    formData.append('usuario', username);
    formData.append('contrasena', password);

    try {
        const response = await fetch('login.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('usuario', data.usuario);
            localStorage.setItem('rol', data.rol.toLowerCase()); // 👈 asegurar formato

            if (data.rol.toLowerCase() === 'administrador') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'empleado-dashboard.html';
            }
        } else {
            document.getElementById('loginError').textContent = 'Usuario o contraseña incorrectos';
        }
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
    }
});








