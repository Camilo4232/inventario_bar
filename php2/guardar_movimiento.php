<?php
date_default_timezone_set('America/Bogota');
$conexion = new mysqli("localhost", "root", "", "sistemainventario");
$conexion->set_charset("utf8");

$producto = $_POST['producto'];
$tipo = $_POST['tipo'];
$cantidad = (int)$_POST['cantidad'];
$fecha = date("Y-m-d H:i:s");

// Obtener ID y nombre exacto del producto
$stmt = $conexion->prepare("SELECT id, nombre FROM producto WHERE nombre = ?");
$stmt->bind_param("s", $producto);
$stmt->execute();
$stmt->bind_result($producto_id, $nombre_producto);
$stmt->fetch();
$stmt->close();

if (!$producto_id) {
    echo json_encode(["success" => false, "error" => "Producto no encontrado"]);
    exit;
}

// Registrar el movimiento (entrada o salida)
if ($tipo === 'Entrada') {
    $sql = "INSERT INTO entrada (producto_id, cantidad, `fecha de entrada`) VALUES (?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("iis", $producto_id, $cantidad, $fecha);
    $stmt->execute();
    $stmt->close();

    // Actualizar inventario (sumar cantidad y nombre)
    $conexion->query("INSERT INTO inventario (producto_id, nombre, cantidad) 
        VALUES ($producto_id, '$nombre_producto', $cantidad)
        ON DUPLICATE KEY UPDATE 
            cantidad = cantidad + $cantidad,
            nombre = VALUES(nombre)");
} else {
    // Verificar si hay suficiente stock antes de registrar la salida
    $result = $conexion->query("SELECT cantidad FROM inventario WHERE producto_id = $producto_id");
    $fila = $result->fetch_assoc();
    $stock_actual = $fila ? $fila['cantidad'] : 0;

    if ($stock_actual < $cantidad) {
        echo json_encode(["success" => false, "error" => "Stock insuficiente"]);
        exit;
    }

    $sql = "INSERT INTO salida (producto_id, cantidad, `fecha de salida`) VALUES (?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("iis", $producto_id, $cantidad, $fecha);
    $stmt->execute();
    $stmt->close();

    // Actualizar inventario (restar)
    $conexion->query("UPDATE inventario SET cantidad = cantidad - $cantidad WHERE producto_id = $producto_id");
}

echo json_encode(["success" => true]);
?>


