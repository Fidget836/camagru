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
            error_log('Erreur lors du décodage de la photo base64');
            http_response_code(400);
            echo 'Erreur lors du décodage de la photo.';
            exit;
        }

        // Créer l'image de la webcam
        $photo = imagecreatefromstring($photoDecoded);
        if (!$photo) {
            error_log('Erreur lors de la création de l\'image à partir de la photo.');
            http_response_code(400);
            echo 'Erreur lors de la création de l\'image à partir de la photo.';
            exit;
        }

        // Charger l'image du sticker à partir de l'URL
        $sticker = imagecreatefrompng("../../frontend/post/stickers/" . $stickerFilename);
        if (!$sticker) {
            error_log('Erreur lors de la création de l\'image à partir du sticker.');
            http_response_code(400);
            echo 'Erreur lors de la création de l\'image à partir du sticker.';
            exit;
        }

        // Activer le mélange d'alpha pour préserver la transparence
        imagealphablending($photo, true);
        imagesavealpha($photo, true);

        // Obtenir la largeur et la hauteur du sticker
        $stickerWidth = imagesx($sticker);
        $stickerHeight = imagesy($sticker);

        // Définir les coordonnées où le sticker sera placé sur l'image de fond
        $destx = (int)rand(0, $canvaWidth * 0.9);
        $desty = (int)rand(0, $canvaHeight * 0.9);

        // Superposer le sticker sur l'image de fond
        imagecopy($photo, $sticker, $destx, $desty, 0, 0, $stickerWidth, $stickerHeight);

        ob_start();
        imagejpeg($photo, null, 100);
        $imageData = ob_get_contents();
        ob_end_clean();

        // Libérer la mémoire
        imagedestroy($photo);
        imagedestroy($sticker);

        $db = new Db();
        $photoModel = new photoModel($db, $imageData);
        $photoModel->stockPhoto($id);
        $db->closeDb();
    } else {
        error_log('Paramètres manquants : photo ou sticker.');
        http_response_code(400);
        echo 'Paramètres manquants !';
    }
}

?>
