<?php

include '../db/db.php';
include '../models/authModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['user_id'])) {
        $user_id = $_POST['user_id'];

        $db = new Db();
        $AuthModel = new AuthModel($db);
        $AuthModel->getUsername($user_id);
        $db->closeDb();
    }
}
?>
