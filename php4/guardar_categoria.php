<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../conexion.php';

$data = json_decode(file_get_contents("php://input"), true);
$nombre = $data['nombre'];

$stmt = $conexion->prepare("INSERT INTO categoria (nombre) VALUES (?)");
$stmt->bind_param("s", $nombre);
$stmt->execute();

if ($success) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'mensaje']);
}

echo json_encode(["success" => true]);
?>
