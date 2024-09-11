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

    private function sendMailPassword($email, $token) {
        $to = $email;
        $subject = "Camagru - Change your password";
        $message = "Click on this link to change your password : https://localhost:8443/changePassword?token=" . $token;
        $headers = "From : tmarie@camagru.com";

        if (mail($to, $subject, $message, $headers)) {
            return (true);
        } else {
            return (false);
        }
    }

    public function changePasswordDisconnect($username, $email) {
        $token = bin2hex(random_bytes(50));

        $this->stmt = $this->db->conn->prepare("UPDATE users SET tokenPassword = :token WHERE username = :username AND email = :email");
        $this->stmt->bindParam(':token', $token);
        $this->stmt->bindParam(':username', $username);
        $this->stmt->bindParam(':email', $email);
        $this->stmt->execute();

        if($this->sendMailPassword($email, $token)) {
            echo json_encode(['status' => 'success', 'message' => 'Mail for change password send sucessful !']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error in sendMailPassword !']);
        }
    }

    public function register($username, $email, $password) {
        try {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $token = bin2hex(random_bytes(50));
                    
            $this->stmt = $this->db->conn->prepare("INSERT INTO users (username, email, password, token) VALUES (:username, :email, :password, :token)");

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

    public function changeUsername($user_id, $username) {
        try {
            $this->stmt = $this->db->conn->prepare("UPDATE users SET username = :newUsername WHERE id = :user_id");
            $this->stmt->bindParam(":newUsername", $username);
            $this->stmt->bindParam(":user_id", $user_id);
            if ($this->stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'The username have been update']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to update the username']);
            }
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $e->getMessage()]);
        }
    }

    public function changeEmail($user_id, $email) {
        try {
            $this->stmt = $this->db->conn->prepare("UPDATE users SET email = :newEmail WHERE id = :user_id");
            $this->stmt->bindParam(":newEmail", $email);
            $this->stmt->bindParam(":user_id", $user_id);
            if ($this->stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'The email have been update']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to update the email']);
            }
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $e->getMessage()]);
        }
    }
}

?>