<?php
$conexion = new mysqli("localhost", "root", "", "sistemainventario");
$conexion->set_charset("utf8");

$sql = "
    SELECT e.id, p.nombre AS producto, 'Entrada' AS tipo, e.cantidad, e.`fecha de entrada` AS fecha
    FROM entrada e
    JOIN producto p ON e.producto_id = p.id
    UNION
    SELECT s.id, p.nombre AS producto, 'Salida' AS tipo, s.cantidad, s.`fecha de salida` AS fecha
    FROM salida s
    JOIN producto p ON s.producto_id = p.id
    ORDER BY fecha DESC
";

$resultado = $conexion->query($sql);
$datos = [];

while ($fila = $resultado->fetch_assoc()) {
    $datos[] = $fila;
}

echo json_encode($datos);
?>
