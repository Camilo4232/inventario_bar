<?php
include '../conexion.php';

$id = $_POST['id'];

$query = "DELETE FROM proveedor WHERE id=?";
$stmt = $conexion->prepare($query);
$stmt->bind_param("i", $id);

echo $stmt->execute() ? 'ok' : 'error';
?>






