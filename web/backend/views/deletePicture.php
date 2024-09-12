<?php

include '../db/db.php';
include '../models/photoModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['post_id']) && isset($_POST['user_id'])) {
        $post_id = $_POST['post_id'];
        $user_id = $_POST['user_id'];

        $db = new Db();
        $photoModel = new photoModel($db, null);
        $photoModel->deletePicture($post_id, $user_id);
        $db->closeDb();
    }
}
?>
