<?php

include '../db/db.php';
include '../models/photoModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['id'])) {
        $id = $_POST['id'];

    $db = new Db();
    $photoModel = new photoModel($db, null);
    $photoModel->recoverPictures($id);
    $db->closeDb();
    }
}

?>