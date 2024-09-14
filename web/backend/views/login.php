<?php
session_start([
    'cookie_lifetime' => 86400,
    'cookie_secure' => true,
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
]);

include '../db/db.php';
include '../controllers/authController.php';
include '../models/authModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($_POST['usernameLogin']) ? $_POST['usernameLogin'] : '';
    $password = isset($_POST['passwordLogin']) ? $_POST['passwordLogin'] : '';

    $db = new Db();

    $userController = new AuthController($db);
    $userController->login($username, $password);
    $db->closeDb();
}

?>