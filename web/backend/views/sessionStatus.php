<?php

    session_start();

    $response = [
        'loggedIn' => isset($_SESSION['user_id']),
        'username' => isset($_SESSION['username']) ? $_SESSION['username'] : ''
    ];

    echo json_encode($response);
    
?>