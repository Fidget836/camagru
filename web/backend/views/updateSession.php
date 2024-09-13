<?php

    session_start();

    include '../db/db.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['user_id'])) {
            $user_id = $_POST['user_id'];
    
            $db = new Db();
            $stmt = $db->conn->prepare("SELECT * FROM users WHERE id = :user_id");
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $_SESSION['user_id'] = $result['id'];
            $_SESSION['username'] = $result['username'];
            $_SESSION['notification'] = $result['notification'];
            $db->closeDb();
        }
    }
    

    $response = [
        'loggedIn' => isset($_SESSION['user_id']),
        'username' => $_SESSION['username'],
        'user_id' => $_SESSION['user_id'],
        'notification' => $_SESSION['notification']
    ];

    echo json_encode($response);
    
?>