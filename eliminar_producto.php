<?php
include 'conexion.php';

$id = $_POST['id'];

$stmt = $conexion->prepare("DELETE FROM producto WHERE id = ?");
$stmt->bind_param("i", $id);

echo $stmt->execute() ? json_encode(['success' => true]) : json_encode(['success' => false]);
?>

