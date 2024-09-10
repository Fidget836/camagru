<?php

    include '../db/db.php';
    include '../models/mailModel.php';

    if (isset($_GET['token'])) {
        $token = $_GET['token'];

        $db = new Db();
        $mailModel = new mailModel($db);
        $mailModel->verifyToken($token);
        $db->closeDb();
        header("Location: https://localhost:8443/profil");
    }

?>