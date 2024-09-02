<?php

include '../db/db.php';
include '../models/photoModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['id']) && isset($_POST['nbPicture'])) {
        $id = $_POST['id'];
        $nbPicture = $_POST['nbPicture'];

    $db = new Db();
    $photoModel = new photoModel($db, null);
    $photoModel->recoverPictures($id, $nbPicture);
    $db->closeDb();
    }
}

?>