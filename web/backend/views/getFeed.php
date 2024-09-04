<?php

include '../db/db.php';
include '../models/photoModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['offset']) && isset($_POST['nbPicture'])) {
        $offset = $_POST['offset'];
        $nbPicture = $_POST['nbPicture'];

    $db = new Db();
    $photoModel = new photoModel($db, null);
    $photoModel->recoverFeed($offset, $nbPicture);
    $db->closeDb();
    }
}

?>