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

$results = [];

try {
    // Agregar columna currentWeight
    try {
        $db->exec("ALTER TABLE user_data ADD COLUMN currentWeight DECIMAL(5,2) AFTER user_id");
        $results[] = "✅ Columna currentWeight agregada";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            $results[] = "⚠️ Columna currentWeight ya existe";
        } else {
            throw $e;
        }
    }

    // Agregar columna targetWeight
    try {
        $db->exec("ALTER TABLE user_data ADD COLUMN targetWeight DECIMAL(5,2) AFTER goal_weight");
        $results[] = "✅ Columna targetWeight agregada";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            $results[] = "⚠️ Columna targetWeight ya existe";
        } else {
            throw $e;
        }
    }

    // Agregar columna timeframeWeeks
    try {
        $db->exec("ALTER TABLE user_data ADD COLUMN timeframeWeeks INT DEFAULT 12 AFTER targetWeight");
        $results[] = "✅ Columna timeframeWeeks agregada";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            $results[] = "⚠️ Columna timeframeWeeks ya existe";
        } else {
            throw $e;
        }
    }

    // Agregar columna goal
    try {
        $db->exec("ALTER TABLE user_data ADD COLUMN goal VARCHAR(20) DEFAULT 'maintain' AFTER timeframeWeeks");
        $results[] = "✅ Columna goal agregada";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            $results[] = "⚠️ Columna goal ya existe";
        } else {
            throw $e;
        }
    }

    // Agregar columna tdee
    try {
        $db->exec("ALTER TABLE user_data ADD COLUMN tdee INT AFTER goal");
        $results[] = "✅ Columna tdee agregada";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            $results[] = "⚠️ Columna tdee ya existe";
        } else {
            throw $e;
        }
    }

    // Agregar columna dailyCalories
    try {
        $db->exec("ALTER TABLE user_data ADD COLUMN dailyCalories INT AFTER tdee");
        $results[] = "✅ Columna dailyCalories agregada";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            $results[] = "⚠️ Columna dailyCalories ya existe";
        } else {
            throw $e;
        }
    }

    // Agregar columna macros
    try {
        $db->exec("ALTER TABLE user_data ADD COLUMN macros JSON AFTER dailyCalories");
        $results[] = "✅ Columna macros agregada";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            $results[] = "⚠️ Columna macros ya existe";
        } else {
            throw $e;
        }
    }

    // Migrar datos existentes
    try {
        $db->exec("UPDATE user_data SET currentWeight = weight WHERE currentWeight IS NULL AND weight IS NOT NULL");
        $results[] = "✅ Datos migrados de weight a currentWeight";
    } catch (PDOException $e) {
        $results[] = "⚠️ Error al migrar weight: " . $e->getMessage();
    }

    try {
        $db->exec("UPDATE user_data SET targetWeight = goal_weight WHERE targetWeight IS NULL AND goal_weight IS NOT NULL");
        $results[] = "✅ Datos migrados de goal_weight a targetWeight";
    } catch (PDOException $e) {
        $results[] = "⚠️ Error al migrar goal_weight: " . $e->getMessage();
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Migración completada",
        "details" => $results
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error ejecutando migración: " . $e->getMessage(),
        "details" => $results
    ], JSON_PRETTY_PRINT);
}
?>
