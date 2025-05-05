<?php
include '../conexion.php';

$nombre = $_POST['nombre'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$email = $_POST['email'] ?? '';

$query = "INSERT INTO proveedor (nombre, telefono, email) VALUES (?, ?, ?)";
$stmt = $conexion->prepare($query);

if (!$stmt) {
    echo 'error';
    exit;
}

$stmt->bind_param("sss", $nombre, $telefono, $email);

echo $stmt->execute() ? 'ok' : 'error';
?>




