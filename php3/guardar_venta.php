<?php
date_default_timezone_set('America/Bogota');

$conexion = new mysqli("localhost", "root", "", "sistemainventario");

if ($conexion->connect_error) {
  die("Error de conexión: " . $conexion->connect_error);
}

$productos = json_decode($_POST['productos'], true);
$metodo_pago = $_POST['metodo_pago'];  // Método de pago
$monto_pago = $_POST['monto_pago'];    // Monto pagado
$fecha = date("Y-m-d H:i:s");

// Registrar la venta con el método de pago y monto
$stmt = $conexion->prepare("INSERT INTO venta (fecha, metodo_pago, monto_pago) VALUES (?, ?, ?)");
$stmt->bind_param("ssd", $fecha, $metodo_pago, $monto_pago);
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


