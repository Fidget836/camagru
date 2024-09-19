<?php

class mailModel {
    private $db;
    private $stmt;

    public function __construct($db) {
        $this->db = $db;
    }

    public function verifyToken($token) {
        $this->stmt = $this->db->conn->prepare("SELECT * FROM users WHERE token = :token");
        $this->stmt->bindParam(":token", $token);
        $this->stmt->execute();
        $user = $this->stmt->fetch();

        if ($user) {
            $this->stmt = $this->db->conn->prepare("UPDATE users SET token = NULL, verified = true WHERE id = :id");
            $this->stmt->bindParam(":id", $user['id']);
            $this->stmt->execute();
        } else {
        }
    }

    public function changePassword($token, $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $this->stmt = $this->db->conn->prepare("UPDATE users SET password = :password WHERE tokenPassword = :tokenPassword");
        $this->stmt->bindParam(":password", $hashedPassword);
        $this->stmt->bindParam(":tokenPassword", $token);
        $this->stmt->execute();
        $result = $this->stmt->rowCount();
        if ($result !== 0) {
            $this->stmt = $this->db->conn->prepare("UPDATE users SET tokenPassword = NULL WHERE tokenPassword = :tokenPassword");
            $this->stmt->bindParam(":tokenPassword", $token);
            $this->stmt->execute();
            echo json_encode(['status' => 'success', 'message' => 'The password have been changed']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Your link to change password is not good']);
        }
    }

};

?>