<?php

class AuthModel {
    private $db;
    private $stmt;

    public function __construct($db) {
        $this->db = $db;
    }

    private function sendValidationMail($email, $token) {
        $to = $email;
        $subject = "Camagru - Validation account";
        $message = "Click on this link to valid your account : https://localhost:8443/backend/views/verifyMail.php?token=" . $token;
        $headers = "From : tmarie@camagru.com";

        if (mail($to, $subject, $message, $headers)) {
            return (true);
        } else {
            return (false);
        }
    }

    public function register($username, $email, $password) {
        try {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $token = bin2hex(random_bytes(50));
                    
            $this->stmt = $this->db->conn->prepare("INSERT INTO users (username, email, password, token) VALUES (:username, :email, :password, :token);");

            $this->stmt->bindParam(':username', $username);
            $this->stmt->bindParam(':email', $email);
            $this->stmt->bindParam(':password', $hashedPassword);
            $this->stmt->bindParam(':token', $token);

            $this->stmt->execute();

            if($this->sendValidationMail($email, $token)) {
                echo json_encode(['status' => 'success', 'message' => 'Registration sucessful !']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error in sendValidationMail !']);
            }

        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $e->getMessage()]);
        }
    }
}

?>