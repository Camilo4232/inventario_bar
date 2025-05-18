<?php
include('../conexion.php'); 

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Consulta para obtener el precio del producto por su ID.
    $query = "SELECT precio FROM producto WHERE id = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $producto = $result->fetch_assoc();
        echo json_encode(['precio' => $producto['precio']]);
    } else {
        echo json_encode(['error' => 'Producto no encontrado']);
    }
}
?>
