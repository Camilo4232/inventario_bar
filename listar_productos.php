<?php
include 'conexion.php';

$sql = "SELECT p.id, p.nombre, p.descripcion, p.precio, p.cantidad_en_stock, p.estado, pr.nombre AS proveedor_nombre
        FROM producto p
        JOIN proveedor pr ON p.proveedor = pr.id";

$result = $conexion->query($sql);

$productos = [];

while ($row = $result->fetch_assoc()) {
    $productos[] = $row;
}

echo json_encode($productos);
?>

