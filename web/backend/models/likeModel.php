<?php

class likeModel {
    private $db;
    private $stmt;

    public function __construct($db) {
        $this->db = $db;
    }

    public function putLike($user_id) {
        $this->stmt = $this->db->conn->prepare("INSERT INTO likes (user_id) VALUES (:user_id)");
        $this->stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        
        if ($this->stmt->execute()) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Like is valid"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Error to put the like"]);
        }
    }

    public function getLike($user_id) {
        $this->stmt = $this->db->conn->prepare("SELECT COUNT(*) FROM likes WHERE user_id = ?");
        $this->stmt->bindParam(1, $user_id, PDO::PARAM_INT);
        
        if ($this->stmt->execute()) {
            $result = $this->stmt->fetch();
            http_response_code(200);
            echo json_encode(["status" => "success", "result" => $result]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Error to put the like"]);
        }
    }

    public function deleteLike($user_id) {
        $this->stmt = $this->db->conn->prepare("DELETE FROM likes WHERE user_id = ?");
        $this->stmt->bindParam(1, $user_id, PDO::PARAM_INT);
        
        if ($this->stmt->execute()) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "The like have been delete"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Error to delete the like"]);
        }
    }
}

?>