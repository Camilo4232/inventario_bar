<?php
include '../conexion.php';

$id = $_GET['id'];

$stmt = $conexion->prepare("DELETE FROM categoria WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["success" => true]);
?>
