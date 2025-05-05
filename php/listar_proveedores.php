<?php
include '../conexion.php';

$query = "SELECT * FROM proveedor";
$result = $conexion->query($query);

$proveedores = [];
while ($row = $result->fetch_assoc()) {
    $proveedores[] = $row;
}

echo json_encode($proveedores);
?>




