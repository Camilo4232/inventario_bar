const rol = localStorage.getItem('rol');
if (!rol) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('reportes-tbody');

    // Simulación de reportes, puedes conectarlo después a movimientos reales
    const reportes = [
        { producto: 'Cerveza', movimientos: 15, stock: 30 },
        { producto: 'Ron', movimientos: 10, stock: 20 },
        { producto: 'Whisky', movimientos: 5, stock: 12 },
    ];

    function renderizarReportes() {
        tbody.innerHTML = '';
        reportes.forEach((rep, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${rep.producto}</td>
                <td>${rep.movimientos}</td>
                <td>${rep.stock}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderizarReportes();

    document.getElementById('volverBtn').addEventListener('click', () => {
        window.location.href = rol === 'Administrador' ? 'admin-dashboard.html' : 'empleado-dashboard.html';
    });
});
