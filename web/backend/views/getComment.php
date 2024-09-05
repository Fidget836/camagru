<?php

include '../db/db.php';
include '../models/commentModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['id']) && isset($_POST['nbPicture'])) {
        $id = $_POST['id'];
        $nbPicture = $_POST['nbPicture'];

        $db = new Db();
        $commentModel = new commentModel($db);
        $commentModel->getComment($id, $nbPicture);
        $db->closeDb();
    }
}

?>
