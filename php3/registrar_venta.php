<?php
include '../conexion.php';

$data = json_decode(file_get_contents("php://input"), true);
$productos = $data['productos'];
$empleado_id = 2; // reemplazar por $_SESSION['id'] si tienes login

$total = array_reduce($productos, function($carry, $item) {
    return $carry + $item['subtotal'];
}, 0);

$conn->begin_transaction();

try {
    $stmt = $conn->prepare("INSERT INTO venta (total, empleado_id) VALUES (?, ?)");
    $stmt->bind_param("di", $total, $empleado_id);
    $stmt->execute();
    $venta_id = $stmt->insert_id;

    $stmt_detalle = $conn->prepare("INSERT INTO detalle_venta (venta_id, producto_id, cantidad, subtotal) VALUES (?, ?, ?, ?)");
    foreach ($productos as $prod) {
        $stmt_detalle->bind_param("iiid", $venta_id, $prod['id'], $prod['cantidad'], $prod['subtotal']);
        $stmt_detalle->execute();
    }

    $conn->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
