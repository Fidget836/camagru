<?php

include '../db/db.php';
include '../controllers/authController.php';
include '../models/authModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['user_id']) && isset($_POST['email'])) {
        $user_id = $_POST['user_id'];
        $email = $_POST['email'];

        $db = new Db();
        $AuthController = new AuthController($db);
        $AuthController->changeEmail($email);
        $AuthModel = new AuthModel($db);
        $AuthModel->changeEmail($user_id, $email);
        $db->closeDb();
    }
}
?>
