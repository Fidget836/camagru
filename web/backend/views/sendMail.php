<?php
error_log("Lancement du script d'envoi d'email");

$to = 'thomas.marie836@gmail.com';
$subject = 'Nouveau mail';
$message = 'STP MARCHE';
$headers = 'From: webmaster@example.com';

if (mail($to, $subject, $message, $headers)) {
    error_log("Email envoyé avec succès à $to");
    echo json_encode(['status' => 'success', 'message' => 'Email envoyé']);
} else {
    error_log("Échec de l'envoi du mail à $to");
    echo json_encode(['status' => 'error', 'message' => "Échec de l'envoi du mail"]);
}
?>
