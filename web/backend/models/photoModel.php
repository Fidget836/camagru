<?php

class photoModel {
    private $db;
    private $stmt;
    private $imageData;

    public function __construct($db, $imageData) {
        $this->db = $db;
        $this->imageData = $imageData;
    }

    public function stockPhoto($id) {
        try {
            $userId = $id;

            $this->stmt = $this->db->conn->prepare("INSERT INTO posts (user_id, photoData) VALUES (?, ?)");
            $this->stmt->bindParam(1, $userId, PDO::PARAM_INT);
            $this->stmt->bindParam(2, $this->imageData, PDO::PARAM_LOB);

            if ($this->stmt->execute()) {
                header('Content-Type: image/jpeg');
                echo $this->imageData;
                http_response_code(200);
            } else {
                http_response_code(500);
                echo 'Erreur lors de l\'enregistrement de l\'image dans la base de données.';
            }
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $e->getMessage()]);
        }
    }

    public function recoverPictures($id, $nbPicture) {
        $this->stmt = $this->db->conn->prepare("SELECT photoData FROM posts WHERE user_id = ? ORDER BY create_at DESC LIMIT ?");
        $this->stmt->bindParam(1, $id, PDO::PARAM_INT);
        $this->stmt->bindParam(2, $nbPicture, PDO::PARAM_INT);
        $this->stmt->execute();
        $pictures = $this->stmt->fetchAll(PDO::FETCH_ASSOC);

        $picturesBase64 = [];
        foreach($pictures as $picture) {
            $picturesBase64[] = base64_encode($picture['photoData']);
        }

        echo json_encode(['status' => 'success', 'result' => $picturesBase64]);
    }

    public function recoverFeed($offset, $nbPicture) {
        $this->stmt = $this->db->conn->prepare("SELECT id, user_id, photoData FROM posts ORDER BY create_at DESC LIMIT ? OFFSET ?");
        $this->stmt->bindParam(1, $nbPicture, PDO::PARAM_INT);
        $this->stmt->bindParam(2, $offset, PDO::PARAM_INT);
        $this->stmt->execute();
        $pictures = $this->stmt->fetchAll(PDO::FETCH_ASSOC);


        if (!$pictures) {
            echo json_encode(['status' => 'error', 'message' => 'Aucune photo trouvée']);
            return;
        }

        $picturesBase64 = [];
        foreach ($pictures as $picture) {
            $picturesBase64[] = [
                'id' => $picture['id'],
                'user_id' => $picture['user_id'],
                'photoData' => base64_encode($picture['photoData'])
            ];
        }

        echo json_encode(['status' => 'success', 'result' => $picturesBase64]);
    }

    public function deletePicture($post_id, $user_id) {
        $this->stmt = $this->db->conn->prepare("DELETE FROM posts WHERE id = :post_id AND user_id = :user_id");
        $this->stmt->bindParam(":post_id", $post_id);
        $this->stmt->bindParam(":user_id", $user_id);
        $this->stmt->execute();
        $result = $this->stmt->rowCount();
        if ($result !== 0) {
            echo json_encode(['status' => 'success', 'message' => "Your picture have been deleted !"]);
        } else {
            echo json_encode(['status' => 'error', 'message' => "Problem to delete the picture"]);
        }
    }

}
?>
