<?php
include '../conexion.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];
$nombre = $data['nombre'];

$stmt = $conexion->prepare("UPDATE categoria SET nombre = ? WHERE id = ?");
$stmt->bind_param("si", $nombre, $id);
$stmt->execute();

echo json_encode(["success" => true]);
?>
