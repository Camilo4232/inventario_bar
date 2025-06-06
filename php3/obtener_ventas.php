<?php
include('../conexion.php');

$query = "
    SELECT 
        v.id AS venta_id, 
        v.fecha, 
        v.metodo_pago, 
        v.monto_pago, 
        GROUP_CONCAT(p.nombre ORDER BY p.nombre) AS productos
    FROM venta v
    INNER JOIN venta_producto pv ON v.id = pv.id_venta
    INNER JOIN producto p ON pv.id_producto = p.id
    GROUP BY v.id
    ORDER BY v.fecha DESC
";

$result = $conexion->query($query);

$ventas = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
            $ventas[] = [
            'id' => $row['venta_id'],
            'fecha' => $row['fecha'],
            'productos' => $row['productos'],
            'metodo_pago' => $row['metodo_pago'],
            'monto_pago' => $row['monto_pago']
        ];
    }
}

echo json_encode($ventas);
$conexion->close();
?>

