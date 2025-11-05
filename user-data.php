<?php
require_once 'cors-handler.php';
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Error de conexión a la base de datos"));
    exit();
}

// OBTENER DATOS DEL USUARIO
if ($method === 'GET') {
    $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

    if (!$user_id) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "ID de usuario requerido"));
        exit();
    }

    $query = "SELECT * FROM user_data WHERE user_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);

        // Transformar nombres de columnas de snake_case a camelCase
        $transformedData = array(
            'id' => isset($userData['id']) ? $userData['id'] : null,
            'user_id' => isset($userData['user_id']) ? $userData['user_id'] : null,
            'currentWeight' => isset($userData['currentWeight']) ? $userData['currentWeight'] : null,
            'height' => isset($userData['height']) ? $userData['height'] : null,
            'age' => isset($userData['age']) ? $userData['age'] : null,
            'gender' => isset($userData['gender']) ? $userData['gender'] : null,
            'activityLevel' => isset($userData['activity_level']) ? $userData['activity_level'] : null,
            'targetWeight' => isset($userData['targetWeight']) ? $userData['targetWeight'] : null,
            'timeframeWeeks' => isset($userData['timeframeWeeks']) ? $userData['timeframeWeeks'] : null,
            'goal' => isset($userData['goal']) ? $userData['goal'] : null,
            'tdee' => isset($userData['tdee']) ? $userData['tdee'] : null,
            'dailyCalories' => isset($userData['dailyCalories']) ? $userData['dailyCalories'] : null,
            'macros' => null
        );

        // Decodificar macros de JSON
        if (isset($userData['macros']) && $userData['macros']) {
            $transformedData['macros'] = json_decode($userData['macros'], true);
        }

        http_response_code(200);
        echo json_encode(array("success" => true, "userData" => $transformedData));
    } else {
        http_response_code(200);
        echo json_encode(array("success" => true, "userData" => null));
    }
}

// GUARDAR/ACTUALIZAR DATOS DEL USUARIO
elseif ($method === 'POST' || $method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->user_id)) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "ID de usuario requerido"));
        exit();
    }

    // Verificar si ya existen datos para este usuario
    $query = "SELECT id FROM user_data WHERE user_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->execute();

    // Preparar los datos
    $currentWeight = isset($data->currentWeight) ? $data->currentWeight : null;
    $height = isset($data->height) ? $data->height : null;
    $age = isset($data->age) ? $data->age : null;
    $gender = isset($data->gender) ? $data->gender : null;
    $activityLevel = isset($data->activityLevel) ? $data->activityLevel : null;
    $targetWeight = isset($data->targetWeight) ? $data->targetWeight : null;
    $timeframeWeeks = isset($data->timeframeWeeks) ? $data->timeframeWeeks : 12;
    $goal = isset($data->goal) ? $data->goal : 'maintain';
    $tdee = isset($data->tdee) ? $data->tdee : null;
    $dailyCalories = isset($data->dailyCalories) ? $data->dailyCalories : null;
    $macros = isset($data->macros) ? json_encode($data->macros) : null;

    if ($stmt->rowCount() > 0) {
        // UPDATE
        $query = "UPDATE user_data SET
                  currentWeight = :currentWeight,
                  height = :height,
                  age = :age,
                  gender = :gender,
                  activity_level = :activityLevel,
                  targetWeight = :targetWeight,
                  timeframeWeeks = :timeframeWeeks,
                  goal = :goal,
                  tdee = :tdee,
                  dailyCalories = :dailyCalories,
                  macros = :macros
                  WHERE user_id = :user_id";
    } else {
        // INSERT
        $query = "INSERT INTO user_data
                  (user_id, currentWeight, height, age, gender, activity_level, targetWeight, timeframeWeeks, goal, tdee, dailyCalories, macros)
                  VALUES
                  (:user_id, :currentWeight, :height, :age, :gender, :activityLevel, :targetWeight, :timeframeWeeks, :goal, :tdee, :dailyCalories, :macros)";
    }

    $stmt = $db->prepare($query);

    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":currentWeight", $currentWeight);
    $stmt->bindParam(":height", $height);
    $stmt->bindParam(":age", $age);
    $stmt->bindParam(":gender", $gender);
    $stmt->bindParam(":activityLevel", $activityLevel);
    $stmt->bindParam(":targetWeight", $targetWeight);
    $stmt->bindParam(":timeframeWeeks", $timeframeWeeks);
    $stmt->bindParam(":goal", $goal);
    $stmt->bindParam(":tdee", $tdee);
    $stmt->bindParam(":dailyCalories", $dailyCalories);
    $stmt->bindParam(":macros", $macros);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("success" => true, "message" => "Datos guardados correctamente"));
    } else {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Error al guardar datos"));
    }
}

else {
    http_response_code(404);
    echo json_encode(array("success" => false, "message" => "Endpoint no encontrado"));
}
?>
