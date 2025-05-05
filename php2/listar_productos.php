<?php
$conexion = new mysqli("localhost", "root", "", "sistemainventario");
$conexion->set_charset("utf8");

$sql = "SELECT nombre FROM producto ORDER BY nombre";
$resultado = $conexion->query($sql);
$datos = [];

while ($fila = $resultado->fetch_assoc()) {
    $datos[] = $fila;
}

echo json_encode($datos);
?>
