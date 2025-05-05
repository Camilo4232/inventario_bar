<?php
include 'conexion.php';

$id = $_GET['id'];

$stmt = $conexion->prepare("SELECT * FROM producto WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

$resultado = $stmt->get_result();
echo json_encode($resultado->fetch_assoc());
?>
