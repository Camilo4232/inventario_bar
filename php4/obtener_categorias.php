<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

$conexion = new mysqli("localhost", "root", "", "sistemainventario");
$conexion->set_charset("utf8");

// Verifica errores de conexión
if ($conexion->connect_error) {
    echo json_encode(['error' => 'Error de conexión: ' . $conexion->connect_error]);
    exit;
}

$resultado = $conexion->query("SELECT * FROM categoria");

// Verifica errores en la consulta
if (!$resultado) {
    echo json_encode(['error' => 'Error en la consulta: ' . $conexion->error]);
    exit;
}
if ($conexion->connect_error) {
    echo json_encode(['error' => 'Error de conexión: ' . $conexion->connect_error]);
    exit;
}
$categorias = [];
while ($fila = $resultado->fetch_assoc()) {
    $categorias[] = $fila;
}

echo json_encode($categorias);
?>



