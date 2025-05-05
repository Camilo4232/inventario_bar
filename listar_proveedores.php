<?php
include 'conexion.php';

$query = "SELECT id, nombre FROM proveedor"; // Seleccionar id y nombre del proveedor
$result = $conexion->query($query);

$proveedores = [];
while ($row = $result->fetch_assoc()) {
    $proveedores[] = $row;
}

echo json_encode($proveedores); // Convertir a formato JSON y devolverlo
?>


