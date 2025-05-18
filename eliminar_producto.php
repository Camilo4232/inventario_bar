<?php
include 'conexion.php';


$id = $_POST['id'] ?? 0;

try {
    $stmt = $conexion->prepare("DELETE FROM producto WHERE id = ?");
    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        // Si falla execute, chequeamos error
       if ($stmt->errno == 1451) {
    echo json_encode([
        'success' => false,
        'message' => 'No se puede eliminar el producto porque ya ha sido usado en una venta.'
    ]);
    exit;
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Error desconocido al eliminar el producto.'
            ]);
            exit;
        }
    }

    // Aquí la eliminación fue exitosa
    echo json_encode(['success' => true]);

} catch (mysqli_sql_exception $e) {
    if ($e->getCode() == 1451) {
        echo json_encode([
            'success' => false,
            'message' => 'No se puede eliminar el producto porque ya ha sido usado en una venta.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error desconocido al eliminar el producto.'
        ]);
    }
}
?>






