<?php
include 'conexion.php';

// Recibir datos del producto
$nombre = $_POST['nombre'];
$descripcion = $_POST['descripcion'];
$precio = $_POST['precio'];
$cantidad = $_POST['cantidad'];
$proveedor_id = $_POST['proveedor'];
$estado = $_POST['estado'];

// Preparar la consulta SQL para insertar el producto con el proveedor y estado
$stmt = $conexion->prepare("INSERT INTO producto (nombre, descripcion, precio, cantidad_en_stock, proveedor, estado) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssdiis", $nombre, $descripcion, $precio, $cantidad, $proveedor_id, $estado);

// Enviar respuesta JSON al frontend
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode([
        'success' => false,
        'error' => $stmt->error
    ]);
}
?>




