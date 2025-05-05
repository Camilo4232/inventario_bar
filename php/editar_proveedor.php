<?php
include '../conexion.php';

$id = $_POST['id'];
$nombre = $_POST['nombre'];
$telefono = $_POST['telefono'];
$email = $_POST['email'];

$query = "UPDATE proveedor SET nombre=?, telefono=?, email=? WHERE id=?";
$stmt = $conexion->prepare($query);
$stmt->bind_param("sssi", $nombre, $telefono, $email, $id);

echo $stmt->execute() ? 'ok' : 'error';
?>


