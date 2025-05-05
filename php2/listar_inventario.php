<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);


require '../conexion.php';

$sql = "
    SELECT 
        p.nombre AS producto,
        COALESCE(e.total_entradas, 0) AS total_entradas,
        COALESCE(s.total_salidas, 0) AS total_salidas
    FROM producto p
    LEFT JOIN (
        SELECT producto_id, SUM(cantidad) AS total_entradas
        FROM entrada
        GROUP BY producto_id
    ) e ON p.id = e.producto_id
    LEFT JOIN (
        SELECT producto_id, SUM(cantidad) AS total_salidas
        FROM salida
        GROUP BY producto_id
    ) s ON p.id = s.producto_id
";

$result = $conexion->query($sql);

$inventario = [];

while ($row = $result->fetch_assoc()) {
    $stock = $row['total_entradas'] - $row['total_salidas'];
    $inventario[] = [
        'producto' => $row['producto'],
        'stock' => $stock
    ];
}

echo json_encode($inventario);
$conexion->close();
?>












