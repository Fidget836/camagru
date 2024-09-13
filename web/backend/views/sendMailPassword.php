<?php

    include '../db/db.php';
    include '../controllers/authController.php';
    include '../models/authModel.php';

    if (isset($_POST['username']) && isset($_POST['email'])) {
        $username = $_POST['username'];
        $email = $_POST['email'];

        $db = new Db();
        $authController = new authController($db);
        $authController->changePasswordDisconnect($username, $email);
        $authModel = new authModel($db);
        $authModel->changePasswordDisconnect($username, $email);
        $db->closeDb();
    }

?>