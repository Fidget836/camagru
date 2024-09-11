<?php

class AuthController {
    private $stateRegister = true;
    private $db;
    private $stmt = null;
    private $count = 0;
    private $result = null;
    private $hashPassword = null;

    // Variables ext
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

        $this->emptyLogin();
        $this->isValidPassword();
        $this->verifUser();
    }

    public function changeUsername($username) {
        if (empty($username)) {
            echo json_encode(['status' => 'error', 'message' => "The username can't be empty !"]);
            $this->db->closeDb();
            exit ;
        }
        $this->username = $username;
        $this->uniciteUser();
    }

    public function changeEmail($email) {
        if (empty($email)) {
            echo json_encode(['status' => 'error', 'message' => "The email can't be empty !"]);
            $this->db->closeDb();
            exit ;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['status' => 'error', 'message' => "The syntax of the email is not good"]);
            $this->db->closeDb();
            exit ;
        }
    }

    public function changePasswordDisconnect($username, $email) {
        if (empty($username)) {
            echo json_encode(['status' => 'error', 'message' => "The username can't be empty !"]);
            $this->db->closeDb();
            exit ;
        }

        if (empty($email)) {
            echo json_encode(['status' => 'error', 'message' => "The email can't be empty !"]);
            $this->db->closeDb();
            exit ;
        }

        $this->stmt = $this->db->conn->prepare("SELECT COUNT(*) FROM users WHERE username = :username AND email = :email");
        $this->stmt->bindParam(":username", $username);
        $this->stmt->bindParam(":email", $email);
        $this->stmt->execute();
        $result = $this->stmt->fetch();

        if ($result[0] !== 1) {
            echo json_encode(['status' => 'error', 'message' => "The username or the email not match with your account"]);
            $this->db->closeDb();
            exit ;
        }
    }

    public function verifChangePassword($password, $confirmPassword) {
        if (empty($password) || empty($confirmPassword)) {
            echo json_encode(['status' => 'error', 'message' => 'All fields must be completed !']);
            $this->db->closeDb();
            exit ;
        }

        $this->password = $password;
        $this->confirmPassword = $confirmPassword;
        $this->isValidPassword();
        $this->confirmPasswordEqual();
    }

    private function emptyRegister() {
        if (empty($this->username) || empty($this->email) || empty($this->password) || empty($this->confirmPassword)) {
            echo json_encode(['status' => 'error', 'message' => 'All fields must be completed !']);
            $this->db->closeDb();
            exit ;
        }
    }

    private function emptyLogin() {
        if (empty($this->username) || empty($this->password)) {
            echo json_encode(['status' => 'error', 'message' => 'All fields must be completed !']);
            $this->db->closeDb();
            exit ;
        }
    }

    private function confirmPasswordEqual() {
        if ($this->password !== $this->confirmPassword) {
            echo json_encode(['status' => 'error', 'message' => 'Password and Password Confirmation must be the same !']);
            $this->db->closeDb();
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
                $this->db->closeDb();
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
            $this->db->closeDb();
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
            $this->db->closeDb();
            exit ;
        }
    }

    private function verifUser() {
        //Verif username
        $this->stmt = $this->db->conn->prepare("SELECT * FROM users WHERE username = :username");
        $this->stmt->bindParam(':username', $this->username);
        $this->stmt->execute();
        $this->result = $this->stmt->fetch(PDO::FETCH_ASSOC);

        if ($this->result) {
            $this->hashPassword = $this->result['password'];
        } else {
            echo json_encode(['status' => 'error', 'message' => "This username doesn't exist !"]);
            $this->db->closeDb();
            exit ;
        }

        //Verif Password
        if (!password_verify($this->password, $this->hashPassword)) {
            echo json_encode(['status' => 'error', 'message' => "Wrong password !"]);
            $this->db->closeDb();
            exit ;
        }

        if ($this->result['verified'] == 0) {
            echo json_encode(['status' => 'error', 'message' => "Your account is not verified ! (Check your mail)"]);
            $this->db->closeDb();
            exit ;
        }

        // Store user information in session
        $_SESSION['user_id'] = $this->result['id'];
        $_SESSION['username'] = $this->username;
        echo json_encode(['status' => 'success', 'message' => 'Login sucessful !']);
    }
}

?>