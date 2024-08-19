<?php

class AuthModel {
    private $db;
    private $stmt;

    public function __construct($db) {
        $this->db = $db;
    }

    public function register($username, $email, $password) {
        try {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                    
            $this->stmt = $this->db->conn->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password);");

            $this->stmt->bindParam(':username', $username);
            $this->stmt->bindParam(':email', $email);
            $this->stmt->bindParam(':password', $hashedPassword);

            $this->stmt->execute();
            echo json_encode(['status' => 'success', 'message' => 'Registration sucessful !']);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $e->getMessage()]);
        }
    }
}

?>