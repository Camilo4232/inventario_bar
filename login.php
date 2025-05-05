<?php
header('Content-Type: application/json');
include 'conexion.php'; // Asegúrate de tener este archivo con tu conexión MySQL

$usuario = $_POST['usuario'] ?? '';
$contrasena = $_POST['contrasena'] ?? '';

$sql = "SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $usuario, $contrasena);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    echo json_encode([
        'success' => true,
        'usuario' => $user['usuario'],
        'rol' => strtolower($user['rol'])
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
}
?>








