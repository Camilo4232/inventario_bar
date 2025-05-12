<?php
$conexion = new mysqli("localhost", "root", "", "sistemainventario");
$resultado = $conexion->query("SELECT id, nombre FROM producto");
$productos = [];

while ($fila = $resultado->fetch_assoc()) {
  $productos[] = $fila;
}

echo json_encode($productos);
?>
