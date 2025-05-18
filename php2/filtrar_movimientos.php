<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require '../conexion.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);

$desde = $input['desde'] ?? '';
$hasta = $input['hasta'] ?? '';
$producto = $input['producto'] ?? '';
$categoria = $input['categoria'] ?? '';

// Condiciones
$condicionesEntrada = [];
$condicionesSalida = [];
$condicionesVenta = [];

if ($desde) {
    $condicionesEntrada[] = "e.`fecha de entrada` >= '$desde'";
    $condicionesSalida[] = "s.`fecha de salida` >= '$desde'";
    $condicionesVenta[] = "v.fecha >= '$desde'";
}
if ($hasta) {
    $condicionesEntrada[] = "e.`fecha de entrada` <= '$hasta'";
    $condicionesSalida[] = "s.`fecha de salida` <= '$hasta'";
    $condicionesVenta[] = "v.fecha <= '$hasta'";
}
if ($producto) {
    $condicionesEntrada[] = "p.id = '$producto'";
    $condicionesSalida[] = "p.id = '$producto'";
    $condicionesVenta[] = "p.id = '$producto'";
}
if ($categoria) {
    $condicionesEntrada[] = "p.id_categoria = '$categoria'";
    $condicionesSalida[] = "p.id_categoria = '$categoria'";
    $condicionesVenta[] = "p.id_categoria = '$categoria'";
}

$whereEntrada = $condicionesEntrada ? 'WHERE ' . implode(' AND ', $condicionesEntrada) : '';
$whereSalida = $condicionesSalida ? 'WHERE ' . implode(' AND ', $condicionesSalida) : '';
$whereVenta = $condicionesVenta ? 'WHERE ' . implode(' AND ', $condicionesVenta) : '';

// Consulta combinada
$sql = "
    SELECT 'Entrada' AS tipo, e.`fecha de entrada` AS fecha, p.nombre AS producto, c.nombre AS categoria, e.cantidad
    FROM entrada e
    JOIN producto p ON e.producto_id = p.id
    JOIN categoria c ON p.id_categoria = c.id
    $whereEntrada

    UNION

    SELECT 'Salida' AS tipo, s.`fecha de salida` AS fecha, p.nombre AS producto, c.nombre AS categoria, s.cantidad
    FROM salida s
    JOIN producto p ON s.producto_id = p.id
    JOIN categoria c ON p.id_categoria = c.id
    $whereSalida
    
    UNION

    SELECT 'Venta' AS tipo, v.fecha AS fecha, p.nombre AS producto, c.nombre AS categoria, vp.cantidad
    FROM venta_producto vp
    JOIN venta v ON vp.id_venta = v.id
    JOIN producto p ON vp.id_producto = p.id
    JOIN categoria c ON p.id_categoria = c.id
    $whereVenta
";

$resultado = $conexion->query($sql);
$movimientos = $resultado ? $resultado->fetch_all(MYSQLI_ASSOC) : [];

// Resumen agrupado por producto con filtros aplicados
$sqlResumen = "
SELECT 
    p.nombre AS producto,
    COALESCE(SUM(e.cantidad), 0) AS entradas,
    COALESCE(SUM(s.cantidad), 0) AS salidas
FROM producto p
LEFT JOIN entrada e ON p.id = e.producto_id
LEFT JOIN salida s ON p.id = s.producto_id
LEFT JOIN categoria c ON c.id = p.id_categoria
WHERE 1
" . ($producto ? " AND p.id = '$producto'" : "") . "
" . ($categoria ? " AND p.id_categoria = '$categoria'" : "") . "
" . ($desde ? " AND ((e.`fecha de entrada` >= '$desde') OR (s.`fecha de salida` >= '$desde'))" : "") . "
" . ($hasta ? " AND ((e.`fecha de entrada` <= '$hasta') OR (s.`fecha de salida` <= '$hasta'))" : "") . "
GROUP BY p.id
";

$res = $conexion->query($sqlResumen);
$resumen = $res ? $res->fetch_all(MYSQLI_ASSOC) : [];

echo json_encode([
    'movimientos' => $movimientos,
    'resumen' => $resumen
]);



