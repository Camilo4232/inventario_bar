<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$conexion = new mysqli("localhost", "root", "", "sistemainventario");
$conexion->set_charset("utf8");

$filtro = isset($_GET['categoria']) ? intval($_GET['categoria']) : '';
$condicion = $filtro ? "WHERE producto.id_categoria = $filtro" : '';

$query = "SELECT 
            producto.id, 
            producto.nombre, 
            producto.precio, 
            producto.estado,
            proveedor.nombre AS proveedor_nombre,
            categoria.nombre AS categoria_nombre 
          FROM producto 
          JOIN categoria ON producto.id_categoria = categoria.id
          JOIN proveedor ON producto.proveedor = proveedor.id
          $condicion";

$resultado = $conexion->query($query);

if (!$resultado) {
    echo json_encode(['success' => false, 'error' => $conexion->error]);
    $conexion->close();
    exit;
}

$productos = [];
while ($fila = $resultado->fetch_assoc()) {
    $productos[] = $fila;
}

echo json_encode($productos);

$conexion->close();
?>






