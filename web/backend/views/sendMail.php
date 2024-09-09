<?php
error_log("Lancement du script d'envoi d'email");

$to = 'thomas.marie836@gmail.com';
$subject = 'Test';
$message = 'Ceci est un test';
$headers = 'From: thomas.marie836@gmail.com' . "\r\n" .
           'Reply-To: thomas.marie836@gmail.com' . "\r\n" .
           'X-Mailer: PHP/' . phpversion();

// Validation des adresses email
if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
    error_log("L'adresse email destinataire est invalide.");
    echo json_encode(['status' => 'error', 'message' => 'Adresse email invalide']);
    exit();
}

if (mail($to, $subject, $message, $headers)) {
    error_log("Email envoyé avec succès à $to");
    echo json_encode(['status' => 'success', 'message' => 'Email envoyé']);
} else {
    error_log("Échec de l'envoi du mail à $to");
    echo json_encode(['status' => 'error', 'message' => "Échec de l'envoi du mail"]);
}
?>
