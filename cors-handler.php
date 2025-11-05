<?php
// Archivo dedicado para manejar CORS y peticiones OPTIONS
// DEBE ejecutarse ANTES que cualquier otro código

// Orígenes permitidos
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://carlosos22.github.io'
];

// Obtener el origen de la petición
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Enviar solo UN valor de Access-Control-Allow-Origin
if (!empty($origin) && in_array($origin, $allowed_origins)) {
    // Si el origen está en la lista, usar ese origen específico
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
} else {
    // Si no hay origen o no está en la lista, permitir todos
    header("Access-Control-Allow-Origin: *");
}

// Headers CORS necesarios
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Max-Age: 86400"); // 24 horas

// Si es una petición OPTIONS (preflight), responder inmediatamente con 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Asegurar que se envíen todos los headers antes de salir
    header("Content-Type: text/plain");
    header("Content-Length: 0");
    http_response_code(200);
    exit(0);
}
?>
