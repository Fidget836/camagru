<?php

include '../db/db.php';
include '../controllers/authController.php';
include '../models/authModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($_POST['usernameRegister']) ? $_POST['usernameRegister'] : '';
    $email = isset($_POST['emailRegister']) ? $_POST['emailRegister'] : '';
    $password = isset($_POST['passwordRegister']) ? $_POST['passwordRegister'] : '';
    $confirmPassword = isset($_POST['confirmPasswordRegister']) ? $_POST['confirmPasswordRegister'] : '';

    
    $db = new Db();
    
    $userController = new AuthController($db);
    $userController->register($username, $email, $password, $confirmPassword);
    $userModel = new AuthModel($db);
    $userModel->register($username, $email, $password);
    $db->closeDb();

}

?>