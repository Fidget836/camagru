<?php

include '../db/db.php';
include '../models/notificationModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['user_id'])) {
        $user_id = $_POST['user_id'];

        $db = new Db();
        $notificationModel = new notificationModel($db);
        $notificationModel->setNotificationOFF($user_id);
        $db->closeDb();
    }
}
?>