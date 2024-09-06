<?php

class likeModel {
    private $db;
    private $stmt;

    public function __construct($db) {
        $this->db = $db;
    }

    public function putLike($post_id, $user_id) {
        $this->stmt = $this->db->conn->prepare("INSERT INTO likes (post_id, user_id) VALUES (:post_id, :user_id)");
        $this->stmt->bindParam(':post_id', $post_id, PDO::PARAM_INT);
        $this->stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        
        if ($this->stmt->execute()) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Like is valid"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Error to put the like"]);
        }
    }

    public function getLike($post_id, $user_id) {
        $this->stmt = $this->db->conn->prepare("SELECT COUNT(*) FROM likes WHERE post_id = ? AND user_id = ?");
        $this->stmt->bindParam(1, $post_id, PDO::PARAM_INT);
        $this->stmt->bindParam(2, $user_id, PDO::PARAM_INT);
        
        if ($this->stmt->execute()) {
            $result = $this->stmt->fetch();
            http_response_code(200);
            echo json_encode(["status" => "success", "result" => $result]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Error to put the like"]);
        }
    }

    public function deleteLike($post_id, $user_id) {
        $this->stmt = $this->db->conn->prepare("DELETE FROM likes WHERE post_id = ? AND user_id = ?");
        $this->stmt->bindParam(1, $post_id, PDO::PARAM_INT);
        $this->stmt->bindParam(2, $user_id, PDO::PARAM_INT);
        
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