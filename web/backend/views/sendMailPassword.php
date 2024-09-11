<?php

    include '../db/db.php';
    include '../controllers/authController.php';
    include '../models/authModel.php';

    if (isset($_POST['username']) && isset($_POST['email'])) {
        $username = $_POST['username'];
        $email = $_POST['email'];

        $db = new Db();
        error_log("Test 111");
        $authController = new authController($db);
        $authController->changePasswordDisconnect($username, $email);
        error_log("Test 222");
        $authModel = new authModel($db);
        $authModel->changePasswordDisconnect($username, $email);
        error_log("Test 333");
        $db->closeDb();
    }

?>