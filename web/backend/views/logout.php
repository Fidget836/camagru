<?php

    session_start([
        'cookie_lifetime' => 86400,
        'cookie_secure' => true,
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax',
    ]);

    // Détruire toutes les données de session
    $_SESSION = array();

    // Supprimer le cookie de session
    // if (ini_get("session.use_cookies")) {
    //     $params = session_get_cookie_params();
    //     setcookie(session_name(), '', time() - 42000,
    //         $params["path"], $params["domain"],
    //         $params["secure"], $params["httponly"]
    //     );
    // }

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();

        // Construction manuelle du header Set-Cookie avec SameSite
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"], 
            $params["secure"], $params["httponly"]
        );

        // Ajouter l'en-tête pour SameSite via header() 
        header("Set-Cookie: " . session_name() . "=; expires=" . gmdate('D, d-M-Y H:i:s T', time() - 42000) . "; path=" . $params['path'] . "; domain=" . $params['domain'] . "; secure; HttpOnly; SameSite=Lax");
    }

    session_destroy();

    echo json_encode(['status' => 'success', 'message' => 'Logged out successfully!']);

?>