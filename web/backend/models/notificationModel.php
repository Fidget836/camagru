<?php

class notificationModel {
    private $db;
    private $stmt;

    public function __construct($db) {
        $this->db = $db;
    }


    public function setNotificationON($user_id) {
        $this->stmt = $this->db->conn->prepare("UPDATE users SET notification = true WHERE id = :user_id");
        $this->stmt->bindParam(":user_id", $user_id);
        
        if ($this->stmt->execute()) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Notification is 'on'"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Error to turn 'on' notification"]);
        }
    }

    public function setNotificationOFF($user_id) {
        $this->stmt = $this->db->conn->prepare("UPDATE users SET notification = false WHERE id = :user_id");
        $this->stmt->bindParam(":user_id", $user_id);
        
        if ($this->stmt->execute()) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Notification is 'off'"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Error to turn 'off' notification"]);
        }
    }

        public function getNotification($user_id) {
            $this->stmt = $this->db->conn->prepare("SELECT notification FROM users WHERE id = :user_id");
            $this->stmt->bindParam(":user_id", $user_id);
            $this->stmt->execute();
            $result = $this->stmt->fetch();
            if ($result) {
                echo json_encode(["status" => "success", "message" => $result['notification']]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error to getNotification"]);
            }
        }

};

?>