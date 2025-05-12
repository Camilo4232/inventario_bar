<?php
include('../conexion.php'); // Asegúrate de que el archivo de conexión esté bien configurado

// Verifica si la conexión fue exitosa
if (!$conexion) {
    die("Error de conexión: " . mysqli_connect_error());
}

$query = "SELECT v.id AS venta_id, v.fecha, v.total, u.usuario AS vendedor 
          FROM venta v 
          INNER JOIN usuarios u ON v.empleado_id = u.id
          ORDER BY v.fecha DESC";
$result = mysqli_query($conexion, $query);

if (!$result) {
    die("Error en la consulta: " . mysqli_error($conexion));
}

$ventas = [];
while ($row = mysqli_fetch_assoc($result)) {
    $ventas[] = $row;
}

header('Content-Type: application/json');
echo json_encode($ventas);
?>



