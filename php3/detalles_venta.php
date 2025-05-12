<?php
include('../conexion.php');

$venta_id = $_GET['venta_id']; // Obtener el ID de la venta desde el parámetro

$query = "SELECT p.nombre AS producto, vp.cantidad, p.precio, (vp.cantidad * p.precio) AS subtotal
          FROM venta_producto vp
          INNER JOIN producto p ON vp.id_producto = p.id
          WHERE vp.id_venta = $venta_id";
$result = mysqli_query($conexion, $query);

$detalles = [];
while ($row = mysqli_fetch_assoc($result)) {
    $detalles[] = $row;
}

header('Content-Type: application/json');
echo json_encode($detalles);
?>


