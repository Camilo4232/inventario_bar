<?php
include 'conexion.php';

$id = $_POST['id'];
$nombre = $_POST['nombre'];
$id_categoria = $_POST['id_categoria'];
$precio = $_POST['precio'];
$proveedor_id = $_POST['proveedor'];
$estado = $_POST['estado'];

$stmt = $conexion->prepare("UPDATE producto SET nombre = ?, id_categoria = ?, precio = ?, proveedor = ?, estado = ? WHERE id = ?");
$stmt->bind_param("sidssi", $nombre, $id_categoria, $precio, $proveedor_id, $estado, $id);

if ($stmt->execute()) {
    echo json_encode([
    'success' => true,
    'message' => 'Producto guardado con éxito'
]);
} else {
    echo json_encode([
    'success' => false,
    'message' => 'Error al guardar producto'
]);
}
?>


