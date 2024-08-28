<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['photo']) && isset($_POST['sticker'])) {
        $photoData = $_POST['photo'];
        $stickerFilename = $_POST['sticker'];

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
        $destx = 150;
        $desty = 50;

        // Superposer le sticker sur l'image de fond
        imagecopy($photo, $sticker, $destx, $desty, 0, 0, $stickerWidth, $stickerHeight);

        // Envoyer l'image finale comme réponse
        header('Content-Type: image/jpeg');
        imagejpeg($photo, null, 100);

        // Libérer la mémoire
        imagedestroy($photo);
        imagedestroy($sticker);
    } else {
        error_log('Paramètres manquants : photo ou sticker.');
        http_response_code(400);
        echo 'Paramètres manquants !';
    }
}
?>
