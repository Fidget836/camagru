<?php

class AuthController {
    private $stateRegister = true;
    private $stmt = null;
    private $count = 0;
    private $result = null;

    // Variables ext
    private $db;
    private $username;
    private $email;
    private $password;
    private $confirmPassword;

    public function __construct($db) {
        $this->db = $db;
    }

    public function register($username, $email, $password, $confirmPassword) {
        $this->username = $username;
        $this->email = $email;
        $this->password = $password;
        $this->confirmPassword = $confirmPassword;

        $this->emptyRegister();
        $this->confirmPasswordEqual();
        $this->isValidPassword();
        $this->uniciteUser();
        $this->uniciteEmail();
    }

    public function login($username, $password) {
        $this->username = $username;
        $this->password = $password;

        $this->emptyRegister();
        $this->isValidPassword();
        $this->verifUser();
    }

    private function emptyRegister() {
        if (empty($this->username) || empty($this->email) || empty($this->password) || empty($this->confirmPassword)) {
            echo json_encode(['status' => 'error', 'message' => 'All fields must be completed !']);
            exit ;
        }
    }

    private function emptyLogin() {
        if (empty($this->username) || empty($this->password)) {
            echo json_encode(['status' => 'error', 'message' => 'All fields must be completed !']);
            exit ;
        }
    }

    private function confirmPasswordEqual() {
        if ($this->password !== $this->confirmPassword) {
            echo json_encode(['status' => 'error', 'message' => 'Password and Password Confirmation must be the same !']);
            exit ;
        }
    }

    private function isValidPassword() {
        if (strlen($this->password) < 12            ||
            !preg_match('/[a-z]/', $this->password) ||
            !preg_match('/[A-Z]/', $this->password) || 
            !preg_match('/[0-9]/', $this->password) ||
            !preg_match('/[\W_]/', $this->password) ) {
                echo json_encode(['status' => 'error', 'message' => 'The password need at least 12 characters, one capital letter, one lowercase letter, one number and one special character']);
                exit ;
        }
    }

    private function uniciteUser() {
        $this->stmt = $this->db->conn->prepare("SELECT COUNT(*) FROM users WHERE username = :username");
        $this->stmt->bindParam(':username', $this->username);
        $this->stmt->execute();
        $this->count = $this->stmt->fetchColumn();
        if ($this->count > 0) {
            echo json_encode(['status' => 'error', 'message' => 'This username already exist !']);
            exit ;
        }
    }

    private function uniciteEmail() {
        $this->stmt = $this->db->conn->prepare("SELECT COUNT(*) FROM users WHERE email = :email");
        $this->stmt->bindParam(':email', $this->email);
        $this->stmt->execute();
        $this->count = $this->stmt->fetchColumn();
        if ($this->count > 0) {
            echo json_encode(['status' => 'error', 'message' => 'This email already exist !']);
            exit ;
        }
    }

    private function verifUser() {
        $this->stmt = $this->db->conn->prepare("SELECT * FROM users WHERE username = :username");
        $this->stmt->bindParam(':username', $this->username);
        $this->stmt->execute();
        $this->result = $this->stmt->fetchColumn();

        echo json_encode($this->result);
        exit ;
    }

}

?>