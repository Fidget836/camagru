<?php

include '../db/db.php';
include '../controllers/authController.php';
include '../models/authModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['user_id']) && isset($_POST['username'])) {
        $user_id = $_POST['user_id'];
        $username = $_POST['username'];

        $db = new Db();
        $AuthController = new AuthController($db);
        $AuthController->changeUsername($username);
        $AuthModel = new AuthModel($db);
        $AuthModel->changeUsername($user_id, $username);
        $db->closeDb();
    }
}
?>
