CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id INT UNSIGNED NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    post TEXT,
    photoData MEDIUMBLOB, -- Remplacez photo_url VARCHAR(255) par photoData LONGBLOB pour stocker des images binaires
    `like` BOOLEAN DEFAULT FALSE,
    comment TEXT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);