<?php
    $servernamedb = getenv('MYSQL_HOST') ?: 'db';
    $usernamedb = getenv('MYSQL_USER');
    $passworddb = getenv('MYSQL_PASSWORD');
    $dbname = getenv("MYSQL_DATABASE");

    $conn = new PDO("mysql:host=$servernamedb;dbname=$dbname", $usernamedb, $passworddb);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

?>