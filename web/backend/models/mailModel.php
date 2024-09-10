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
            error_log("ERROR IN USER mailModel");
        }
    }

};

?>