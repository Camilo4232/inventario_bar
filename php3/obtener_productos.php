<?php
include '../conexion.php';

$sql = "SELECT id, nombre, precio FROM producto";
$result = $conexion->query($sql);

$productos = [];

while ($row = $result->fetch_assoc()) {
    $productos[] = $row;
}

echo json_encode($productos);
?>

