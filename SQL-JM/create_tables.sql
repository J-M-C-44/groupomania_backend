-- DROP DATABASE IF EXISTS groupomania;
CREATE DATABASE groupomania;
USE groupomania;

CREATE TABLE users (
    id              INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(200) NOT NULL UNIQUE,
    password        VARCHAR(200) NOT NULL,
    lastname        VARCHAR(60),
    firstname       VARCHAR(60),
    fonction        VARCHAR(60),
    -- avatarUrl à passer à CHAR(51) ?
    avatarUrl       VARCHAR(100),
    role            TINYINT DEFAULT 0,
    createdTime     DATETIME DEFAULT CURRENT_TIMESTAMP,
    modifiedTime    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id              INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId          INTEGER NOT NULL,
    text            TEXT(2000) NOT NULL,
    -- imageUrl à passer à CHAR(51) ?
    imageUrl        VARCHAR(100),
    createdTime     DATETIME DEFAULT CURRENT_TIMESTAMP,
    modifiedTime    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id              INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId          INTEGER NOT NULL,
    postId          INTEGER NOT NULL,
    text            TEXT(1000) NOT NULL,
    imageUrl        VARCHAR(100),
    createdTime     DATETIME DEFAULT CURRENT_TIMESTAMP,
    modifiedTime    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (postId) REFERENCES posts (id) ON DELETE CASCADE
);

CREATE TABLE likes (
    id              INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId          INTEGER NOT NULL,
    postId          INTEGER NOT NULL,
    createdTime     DATETIME DEFAULT CURRENT_TIMESTAMP,
    modifiedTime    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (postId) REFERENCES posts (id) ON DELETE CASCADE
);