<?php

include '../db/db.php';
include '../controllers/authController.php';
include '../models/authModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['user_id']) && isset($_POST['password']) && isset($_POST['confirmPassword'])) {
        $user_id = $_POST['user_id'];
        $password = $_POST['password'];
        $confirmPassword = $_POST['confirmPassword'];

        $db = new Db();
        $AuthController = new AuthController($db);
        $AuthController->verifChangePassword($password, $confirmPassword);
        $AuthModel = new AuthModel($db);
        $AuthModel->changePassword($user_id, $password);
        $db->closeDb();
    }
}
?>
