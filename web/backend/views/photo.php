<?php

include '../db/db.php';
include '../models/photoModel.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['photo']) && isset($_POST['sticker']) && isset($_POST['canvaWidth']) && isset($_POST['canvaHeight']) && isset($_POST['id'])) {
        $photoData = $_POST['photo'];
        $stickerFilename = $_POST['sticker'];
        $canvaWidth = $_POST['canvaWidth'];
        $canvaHeight = $_POST['canvaHeight'];
        $id = $_POST['id'];

        // Décoder l'image de la webcam (base64)
        $photoData = str_replace('data:image/png;base64,', '', $photoData);
        $photoDecoded = base64_decode($photoData);

        if ($photoDecoded === false) {
            http_response_code(400);
            echo 'Erreur lors du décodage de la photo.';
            exit;
        }

        // Créer l'image de la webcam
        $photo = imagecreatefromstring($photoDecoded);
        if (!$photo) {
            http_response_code(400);
            echo 'Erreur lors de la création de l\'image à partir de la photo.';
            exit;
        }

        $sticker = imagecreatefrompng("../../frontend/post/stickers/" . $stickerFilename);
        if (!$sticker) {
            http_response_code(400);
            echo 'Erreur lors de la création de l\'image à partir du sticker.';
            exit;
        }

        imagealphablending($photo, true);
        imagesavealpha($photo, true);

        $stickerWidth = imagesx($sticker);
        $stickerHeight = imagesy($sticker);

        // Définir les coordonnées où le sticker sera placé sur l'image de fond
        $destx = rand(-50, (int)floor($canvaWidth * 0.8));
        $desty = rand(-50, (int)floor($canvaHeight * 0.8));
        
        imagecopy($photo, $sticker, $destx, $desty, 0, 0, $stickerWidth, $stickerHeight);

        ob_start();
        imagejpeg($photo, null, 100);
        $imageData = ob_get_contents();
        ob_end_clean();

        imagedestroy($photo);
        imagedestroy($sticker);

        $db = new Db();
        $photoModel = new photoModel($db, $imageData);
        $photoModel->stockPhoto($id);
        $db->closeDb();
    } else {
        http_response_code(400);
        echo 'Paramètres manquants !';
    }
}

?>
