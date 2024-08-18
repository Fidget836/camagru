<?php

    header('Content-Type: application/json');

    function isValidPassword($password) {
        if (strlen($password) >= 12          &&
            preg_match('/[a-z]/', $password) &&
            preg_match('/[A-Z]/', $password) && 
            preg_match('/[0-9]/', $password) &&
            preg_match('/[\W_]/', $password) ) {
                return (true);
        } else {
            return (false);
        }
    };

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = isset($_POST['usernameRegister']) ? $_POST['usernameRegister'] : '';
        $email = isset($_POST['emailRegister']) ? $_POST['emailRegister'] : '';
        $password = isset($_POST['passwordRegister']) ? $_POST['passwordRegister'] : '';
        $confirmPassword = isset($_POST['confirmPasswordRegister']) ? $_POST['confirmPasswordRegister'] : '';

        if (empty($username) || empty($email) || empty($password) || empty($confirmPassword)) {
            echo json_encode(['status' => 'error', 'message' => 'All fields must be completed !']);
            exit ;
        } else if ($password !== $confirmPassword) {
            echo json_encode(['status' => 'error', 'message' => 'Password and Password Confirmation must be the same !']);
        } else if (!isValidPassword($password)) {
            echo json_encode(['status' => 'error', 'message' => 'The password need at least 12 characters, one capital letter, one lowercase letter, one number and one special character']);
        } else {
            $servernamedb = getenv('MYSQL_HOST') ?: 'db';
            $usernamedb = getenv('MYSQL_USER');
            $passworddb = getenv('MYSQL_PASSWORD');
            $dbname = getenv("MYSQL_DATABASE");

            try {
                $conn = new PDO("mysql:host=$servernamedb;dbname=$dbname", $usernamedb, $passworddb);
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                
                //Verif unicite username et email
                $stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE username = :username");
                $stmt->bindParam(':username', $username);
                $stmt->execute();
                $countUsername = $stmt->fetchColumn();
                $stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE email = :email;");
                $stmt->bindParam(':email', $email);
                $stmt->execute();
                $countEmail = $stmt->fetchColumn();

                if ($countUsername > 0) {
                    echo json_encode(['status' => 'error', 'message' => 'This username already exist !']);
                } else if ($countEmail > 0) {
                    echo json_encode(['status' => 'error', 'message' => 'This email is already use !']);
                } else {
                    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                    
                    $sql = "INSERT INTO users (username, email, password) VALUES (:username, :email, :password);";
                    $stmt = $conn->prepare($sql);
    
                    $stmt->bindParam(':username', $username);
                    $stmt->bindParam(':email', $email);
                    $stmt->bindParam(':password', $hashedPassword);
    
                    $stmt->execute();
                    echo json_encode(['status' => 'success', 'message' => 'Registration sucessful !']);
                }
                
            } catch (PDOException $e) {
                echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $e->getMessage()]);
            }

            $conn = null;
        }
    }
    else {
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized method !']);
    }




?>