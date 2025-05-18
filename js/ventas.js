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

    // Cuando seleccionamos un producto, obtenemos su precio
    $("#productoSelect").change(function () {
        const idProducto = $(this).val();
        if (idProducto) {
            $.get(`php3/obtener_precio_producto.php?id=${idProducto}`, function (data) {
                const producto = JSON.parse(data);
                if (producto.precio) {
                    $("#precioProducto").val(producto.precio);
                    actualizarMonto();
                }
            });
        }
    });

    // Cuando se cambia la cantidad, recalcular el monto
    $("#cantidadProducto").on('input', function () {
        actualizarMonto();
    });

    function actualizarMonto() {
        const cantidad = parseInt($("#cantidadProducto").val());
        const precio = parseFloat($("#precioProducto").val());
        
        if (!isNaN(cantidad) && !isNaN(precio) && cantidad > 0) {
            const monto = cantidad * precio;
            $("#montoProducto").val(monto.toFixed(2));
        }
    }

    // Agregar producto a la lista de venta
    $("#agregarProducto").click(function () {
        const id = $("#productoSelect").val();
        const nombre = $("#productoSelect option:selected").text();
        const cantidad = parseInt($("#cantidadProducto").val());
        const monto = parseFloat($("#montoProducto").val());

        if (!id || isNaN(cantidad) || cantidad <= 0) {
            alert("Seleccione un producto y una cantidad válida.");
            return;
        }

        // Verificar si ya está agregado
        const existente = productosVenta.find((p) => p.id === id);
        if (existente) {
            existente.cantidad += cantidad;
            existente.monto += monto;
        } else {
            productosVenta.push({ id, nombre, cantidad, monto });
        }

        renderizarTabla();
        actualizarMontoTotal();
        $("#productoSelect").val("");
        $("#cantidadProducto").val("");
        $("#montoProducto").val("");
    });

    function renderizarTabla() {
        const tbody = $("#listaProductosVenta");
        tbody.empty();
        productosVenta.forEach((p, index) => {
            tbody.append(`
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.cantidad}</td>
                    <td>${p.monto.toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">Eliminar</button></td>
                </tr>
            `);
        });
    }

    window.eliminarProducto = function (index) {
        productosVenta.splice(index, 1);
        renderizarTabla();
        actualizarMontoTotal();
    };

    function actualizarMontoTotal() {
        let total = 0;
        productosVenta.forEach(p => {
            total += p.monto;
        });
        $("#montoPago").val(total.toFixed(2));
    }

    // Enviar venta al backend
    $("#formVenta").submit(function (e) {
        e.preventDefault();
        if (productosVenta.length === 0) {
            alert("Agregue al menos un producto.");
            return;
        }

        // Obtener los datos del método de pago y monto
        const metodoPago = $("#metodoPago").val();
        const montoPago = parseFloat($("#montoPago").val());

        console.log("Método de pago:", metodoPago);
        console.log("Monto de pago:", montoPago);

        // Validación de método de pago y monto
        if (!metodoPago || isNaN(montoPago) || montoPago <= 0) {
            alert("Seleccione un método de pago y un monto válido.");
            return;
        }

        $.ajax({
            url: "php3/guardar_venta.php",
            method: "POST",
            data: {
                productos: JSON.stringify(productosVenta),
                metodo_pago: metodoPago,
                monto_pago: montoPago
            },
            success: function (res) {
                alert("Venta guardada exitosamente.");
                productosVenta = [];
                renderizarTabla();
                actualizarMontoTotal();
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
                            <td>${venta.metodo_pago}</td>
                            <td>$${venta.monto_pago}</td>
                        </tr>
                    `);
                });
            } else {
                tablaVentas.append(`
                    <tr>
                        <td colspan="5">No hay ventas registradas.</td>
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





