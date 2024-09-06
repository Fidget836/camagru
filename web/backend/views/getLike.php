<?php

include '../db/db.php';
include '../models/likeModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['user_id'])) {
        $user_id = $_POST['user_id'];

        $db = new Db();
        $likeModel = new likeModel($db);
        $likeModel->getLike($user_id);
        $db->closeDb();
    }
}
?>
