<?php

    include '../db/db.php';
    include '../models/commentModel.php';
    
    if (isset($_POST['post_id']) && isset($_POST['comment'])) {
        $post_id = $_POST['post_id'];
        $comment = $_POST['comment'];

        $db = new Db();
        $commentModel = new commentModel($db);
        $commentModel->sendMailNewComment($post_id, $comment);
        $db->closeDb();
    }

?>