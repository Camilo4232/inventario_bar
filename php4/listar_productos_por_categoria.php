<?php
include '../conexion.php';

$sql = "SELECT p.*, c.nombre AS categoria
        FROM producto p
        LEFT JOIN categoria c ON p.id_categoria = c.id";
$result = $conexion->query($sql);

$productos = [];
while ($row = $result->fetch_assoc()) {
    $productos[] = $row;
}

echo json_encode($productos);
?>
