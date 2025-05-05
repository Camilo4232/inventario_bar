<?php
include 'conexion.php';

$id = $_POST['id'];
$nombre = $_POST['nombre'];
$descripcion = $_POST['descripcion'];
$precio = $_POST['precio'];
$cantidad = $_POST['cantidad'];
$proveedor_id = $_POST['proveedor'];
$estado = $_POST['estado'];

$stmt = $conexion->prepare("UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, cantidad_en_stock = ?, proveedor = ?, estado = ? WHERE id = ?");
$stmt->bind_param("ssdiisi", $nombre, $descripcion, $precio, $cantidad, $proveedor_id, $estado, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
?>
