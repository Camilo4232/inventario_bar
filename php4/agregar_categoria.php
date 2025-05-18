<?php
header('Content-Type: application/json');

$conexion = new mysqli("localhost", "root", "", "sistemainventario");
$conexion->set_charset("utf8");

$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';

if ($nombre === '') {
    echo json_encode(['success' => false, 'error' => 'Nombre vacío']);
    exit;
}

$stmt = $conexion->prepare("INSERT INTO categoria (nombre) VALUES (?)");
$stmt->bind_param("s", $nombre);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conexion->close();
?>



