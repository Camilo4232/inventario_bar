<?php
$host = "localhost";
$usuario = "root";
$contrasena = "";
$base_datos = "sistemainventario";

$conexion = new mysqli($host, $usuario, $contrasena, $base_datos);
$conexion->set_charset("utf8");
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}
?>



