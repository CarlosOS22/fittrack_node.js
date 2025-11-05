<?php
class Database {
    // Configuración para XAMPP local
    private $host = "localhost";
    private $port = "3307"; // Puerto personalizado de MySQL
    private $database_name = "fittrack";
    private $username = "root";
    private $password = ""; // Sin password en XAMPP por defecto
    public $conn;

    // Obtener la conexión a la base de datos
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->database_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Error de conexión: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>
