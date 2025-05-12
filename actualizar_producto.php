<?php
include 'conexion.php';

$id = $_POST['id'];
$nombre = $_POST['nombre'];
$descripcion = $_POST['descripcion'];
$precio = $_POST['precio'];
$proveedor_id = $_POST['proveedor'];
$estado = $_POST['estado'];

$stmt = $conexion->prepare("UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, proveedor = ?, estado = ? WHERE id = ?");
$stmt->bind_param("ssdssi", $nombre, $descripcion, $precio, $proveedor_id, $estado, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
?>

