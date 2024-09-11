<?php

include '../db/db.php';
include '../controllers/authController.php';
include '../models/mailModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['token']) && isset($_POST['password']) && isset($_POST['confirmPassword'])) {
        $token = $_POST['token'];
        $password = $_POST['password'];
        $confirmPassword = $_POST['confirmPassword'];
        

        $db = new Db();
        $authController = new authController($db);
        $authController->verifChangePassword($password, $confirmPassword);
        $mailModel = new mailModel($db);
        $mailModel->changePassword($token, $password);
        $db->closeDb();
    }
}


?>