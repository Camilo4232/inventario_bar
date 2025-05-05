<?php
include 'conexion.php';  // Asegúrate de tener la conexión a la base de datos en este archivo

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombreProveedor = $_POST['nombre'];

    $sql = "INSERT INTO proveedor (nombre) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $nombreProveedor);

    if ($stmt->execute()) {
        echo "Proveedor agregado exitosamente.";
    } else {
        echo "Error al agregar proveedor: " . $stmt->error;
    }
}
?>

