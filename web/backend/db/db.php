<?php

class Db {
    public $conn = null;

    public function __construct() {
        $servernamedb = getenv('MYSQL_HOST') ?: 'db';
        $usernamedb = getenv('MYSQL_USER');
        $passworddb = getenv('MYSQL_PASSWORD');
        $dbname = getenv("MYSQL_DATABASE");

        $this->conn = new PDO("mysql:host=$servernamedb;dbname=$dbname", $usernamedb, $passworddb);
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function closeDb() {
        $this->conn = null;
    }
};

?>