<?php
$conexion = new mysqli("localhost", "root", "", "sistemainventario");

if ($conexion->connect_error) {
  die("Error de conexión: " . $conexion->connect_error);
}

$productos = json_decode($_POST['productos'], true);
$fecha = date("Y-m-d H:i:s");

// Registrar la venta
$stmt = $conexion->prepare("INSERT INTO venta (fecha) VALUES (?)");
$stmt->bind_param("s", $fecha);
$stmt->execute();
$id_venta = $stmt->insert_id;
$stmt->close();

// Registrar los productos vendidos
$stmtItem = $conexion->prepare("INSERT INTO venta_producto (id_venta, id_producto, cantidad) VALUES (?, ?, ?)");
foreach ($productos as $p) {
  $stmtItem->bind_param("iii", $id_venta, $p["id"], $p["cantidad"]);
  $stmtItem->execute();
}
$stmtItem->close();

echo "ok";
?>
