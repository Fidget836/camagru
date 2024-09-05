<?php

include '../db/db.php';
include '../models/commentModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['post_id']) && isset($_POST['user_id']) && isset($_POST['comment'])) {
        $post_id = $_POST['post_id'];
        $user_id = $_POST['user_id'];
        $comment = $_POST['comment'];

        $db = new Db();
        $commentModel = new commentModel($db);
        $commentModel->putComment($post_id, $user_id, $comment);
        $db->closeDb();
    }
}

?>
