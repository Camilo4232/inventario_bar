<?php
include 'conexion.php';

$id = $_GET['id'];

$stmt = $conexion->prepare("SELECT * FROM producto WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
$producto = $result->fetch_assoc();

echo json_encode($producto);
?>

