<?php
// Script de diagnóstico para FitTrack en XAMPP

header('Content-Type: application/json; charset=UTF-8');

$diagnostico = array();

// 1. Verificar versión de PHP
$diagnostico['php_version'] = phpversion();
$diagnostico['php_version_ok'] = version_compare(phpversion(), '7.4.0', '>=');

// 2. Verificar extensiones necesarias
$diagnostico['pdo_disponible'] = extension_loaded('pdo');
$diagnostico['pdo_mysql_disponible'] = extension_loaded('pdo_mysql');
$diagnostico['json_disponible'] = extension_loaded('json');

// 3. Verificar archivos de configuración
$diagnostico['config_cors_existe'] = file_exists('../config/cors.php');
$diagnostico['config_database_existe'] = file_exists('../config/database.php');

// 4. Verificar permisos de directorio
$diagnostico['directorio_backend'] = dirname(dirname(__FILE__));
$diagnostico['directorio_api'] = dirname(__FILE__);
$diagnostico['directorio_escribible'] = is_writable(dirname(__FILE__));

// 5. Intentar conectar a la base de datos
try {
    require_once '../config/database.php';
    $database = new Database();
    $db = $database->getConnection();

    if ($db) {
        $diagnostico['conexion_db'] = true;
        $diagnostico['conexion_db_mensaje'] = '✅ Conexión exitosa';

        // Intentar obtener tablas
        $stmt = $db->query("SHOW TABLES");
        $tablas = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $diagnostico['tablas_encontradas'] = $tablas;
        $diagnostico['numero_tablas'] = count($tablas);
    } else {
        $diagnostico['conexion_db'] = false;
        $diagnostico['conexion_db_mensaje'] = '❌ No se pudo conectar';
    }
} catch(Exception $e) {
    $diagnostico['conexion_db'] = false;
    $diagnostico['conexion_db_mensaje'] = '❌ Error: ' . $e->getMessage();
}

// 6. Variables del servidor
$diagnostico['server_software'] = $_SERVER['SERVER_SOFTWARE'] ?? 'No disponible';
$diagnostico['document_root'] = $_SERVER['DOCUMENT_ROOT'] ?? 'No disponible';
$diagnostico['script_filename'] = $_SERVER['SCRIPT_FILENAME'] ?? 'No disponible';

// 7. Configuración de la base de datos (sin password)
if (file_exists('../config/database.php')) {
    $config_content = file_get_contents('../config/database.php');
    preg_match('/\$host\s*=\s*"([^"]+)"/', $config_content, $host_match);
    preg_match('/\$port\s*=\s*"([^"]+)"/', $config_content, $port_match);
    preg_match('/\$database_name\s*=\s*"([^"]+)"/', $config_content, $db_match);
    preg_match('/\$username\s*=\s*"([^"]+)"/', $config_content, $user_match);

    $diagnostico['db_config'] = array(
        'host' => $host_match[1] ?? 'no encontrado',
        'port' => $port_match[1] ?? 'no encontrado',
        'database' => $db_match[1] ?? 'no encontrado',
        'username' => $user_match[1] ?? 'no encontrado'
    );
}

// Resumen
$diagnostico['todo_ok'] = (
    $diagnostico['php_version_ok'] &&
    $diagnostico['pdo_disponible'] &&
    $diagnostico['pdo_mysql_disponible'] &&
    $diagnostico['config_cors_existe'] &&
    $diagnostico['config_database_existe'] &&
    $diagnostico['conexion_db']
);

echo json_encode($diagnostico, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
