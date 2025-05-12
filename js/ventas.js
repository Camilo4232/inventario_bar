$(document).ready(function () {
    let productosVenta = [];

    console.log("ventas.js cargado");

    // Cargar productos en el select
    $.get("php3/obtener_productos.php", function (data) {
        const productos = JSON.parse(data);
        productos.forEach((producto) => {
            $("#productoSelect").append(
                `<option value="${producto.id}">${producto.nombre}</option>`
            );
        });
    });

    // Agregar producto a la lista de venta
    $("#agregarProducto").click(function () {
        const id = $("#productoSelect").val();
        const nombre = $("#productoSelect option:selected").text();
        const cantidad = parseInt($("#cantidadProducto").val());

        if (!id || isNaN(cantidad) || cantidad <= 0) {
            alert("Seleccione un producto y una cantidad válida.");
            return;
        }

        // Verificar si ya está agregado
        const existente = productosVenta.find((p) => p.id === id);
        if (existente) {
            existente.cantidad += cantidad;
        } else {
            productosVenta.push({ id, nombre, cantidad });
        }

        renderizarTabla();
        $("#productoSelect").val("");
        $("#cantidadProducto").val("");
    });

    function renderizarTabla() {
        const tbody = $("#listaProductosVenta");
        tbody.empty();
        productosVenta.forEach((p, index) => {
            tbody.append(`
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.cantidad}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">Eliminar</button></td>
                </tr>
            `);
        });
    }

    window.eliminarProducto = function (index) {
        productosVenta.splice(index, 1);
        renderizarTabla();
    };

    // Enviar venta al backend
    $("#formVenta").submit(function (e) {
        e.preventDefault();
        if (productosVenta.length === 0) {
            alert("Agregue al menos un producto.");
            return;
        }

        $.ajax({
            url: "php3/guardar_venta.php",
            method: "POST",
            data: { productos: JSON.stringify(productosVenta) },
            success: function (res) {
                alert("Venta guardada exitosamente.");
                productosVenta = [];
                renderizarTabla();
                $("#modalVenta").modal("hide");
                cargarVentas();
            },
            error: function () {
                alert("Error al guardar la venta.");
            },
        });
    });

    // Cargar ventas existentes
    function cargarVentas() {
        $.get("php3/obtener_ventas.php", function (data) {
            const ventas = JSON.parse(data);
            const tablaVentas = $("#tablaVentas");
            tablaVentas.empty();

            if (ventas.length > 0) {
                ventas.forEach((venta) => {
                    tablaVentas.append(`
                        <tr>
                            <td>${venta.id}</td>
                            <td>${venta.fecha}</td>
                            <td>${venta.productos}</td>
                        </tr>
                    `);
                });
            } else {
                tablaVentas.append(`
                    <tr>
                        <td colspan="3">No hay ventas registradas.</td>
                    </tr>
                `);
            }
        });
    }

    cargarVentas();

    // Botón Volver
    const volverBtn = document.getElementById('volverBtn');
    if (volverBtn) {
        volverBtn.addEventListener('click', () => {
            console.log("Botón volver presionado");
            const rol = localStorage.getItem('rol');
            console.log("Rol detectado:", rol);
            if (rol === 'administrador') {
                window.location.href = 'admin-dashboard.html';
            } else if (rol === 'empleado') {
                window.location.href = 'empleado-dashboard.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }
});
