<?php
session_start([
    'cookie_lifetime' => 86400, // Durée de vie du cookie (en secondes)
    'cookie_secure' => true, // Assurez-vous que vous utilisez HTTPS
    'cookie_httponly' => true, // Le cookie ne sera pas accessible via JavaScript
    'cookie_samesite' => 'Lax', // ou 'Strict' ou 'None' selon vos besoins
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