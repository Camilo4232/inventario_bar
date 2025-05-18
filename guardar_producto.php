<?php
header('Content-Type: application/json');

$conexion = new mysqli("localhost", "root", "", "sistemainventario");
$conexion->set_charset("utf8");

$nombre = $_POST['nombre'];
$precio = $_POST['precio'];
$id_categoria = $_POST['id_categoria'];
$proveedor = $_POST['proveedor'];
$estado = $_POST['estado'];

$query = "INSERT INTO producto (nombre, precio, id_categoria, proveedor, estado) 
          VALUES ('$nombre', '$precio', '$id_categoria', '$proveedor', '$estado')";

if ($conexion->query($query)) {
    echo json_encode([
    'success' => true,
    'message' => 'Producto guardado con éxito'
]);
} else {
    echo json_encode([
    'success' => false,
    'message' => 'Error al guardar producto'
]);
}
?>







