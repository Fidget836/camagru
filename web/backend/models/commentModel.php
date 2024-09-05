<?php

class commentModel {
    private $db;
    private $stmt;

    public function __construct($db) {
        $this->db = $db;
    }

    public function putComment($post_id, $user_id, $comment) {
        $this->stmt = $this->db->conn->prepare("INSERT INTO comments (post_id, user_id, comment) VALUES (:post_id, :user_id, :comment)");
        $this->stmt->bindParam(':post_id', $post_id, PDO::PARAM_INT);
        $this->stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $this->stmt->bindParam(':comment', $comment, PDO::PARAM_STR);

        if ($this->stmt->execute()) { // Fixed: Call execute() on the prepared statement
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Comment has been added']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Adding comment failed']);
        }
    }

    public function getComment($id, $nbPicture) {
        $this->stmt = $this->db->conn->prepare("SELECT comment FROM comments WHERE post_id = ? ORDER BY create_at DESC LIMIT ?");
        $this->stmt->bindParam(1, $id, PDO::PARAM_INT);
        $this->stmt->bindParam(2, $nbPicture, PDO::PARAM_INT);
        if ($this->stmt->execute()) {
            $result = $this->stmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200);
            echo json_encode(['status' => 'success', 'result' => $result]);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Get comment failed']);
        }
    }
}

?>
