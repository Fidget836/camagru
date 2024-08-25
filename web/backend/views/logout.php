<?php

    session_start();

    // Détruire toutes les données de session
    $_SESSION = array();

    // Supprimer le cookie de session
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    session_destroy();

    echo json_encode(['status' => 'success', 'message' => 'Logged out successfully!']);

?>