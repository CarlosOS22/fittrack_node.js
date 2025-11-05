<?php
require_once 'cors-handler.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Error de conexión a la base de datos"));
    exit();
}

// Verificar columnas de la tabla user_data
$query = "DESCRIBE user_data";
$stmt = $db->prepare($query);
$stmt->execute();
$columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

$requiredColumns = [
    'currentWeight',
    'targetWeight',
    'timeframeWeeks',
    'goal',
    'tdee',
    'dailyCalories',
    'macros'
];

$existingColumns = array_column($columns, 'Field');
$missingColumns = array_diff($requiredColumns, $existingColumns);

$response = [
    'success' => true,
    'existingColumns' => $existingColumns,
    'missingColumns' => array_values($missingColumns),
    'needsMigration' => count($missingColumns) > 0
];

if (count($missingColumns) > 0) {
    $response['message'] = 'Faltan ' . count($missingColumns) . ' columnas. Necesitas ejecutar la migración.';
} else {
    $response['message'] = 'Todas las columnas necesarias existen. La base de datos está actualizada.';
}

http_response_code(200);
echo json_encode($response, JSON_PRETTY_PRINT);
?>
