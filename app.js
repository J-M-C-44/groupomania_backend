'use strict';

// <------------------------------------- imports --------------------------------------->
const express = require('express');  // framework d'application web pour node.js

const path = require('path'); // permet de gérer le chemin de fichier

// Helmet : permet de sécuriser l'application express en configurant de manière appropriée les en-têtes HTTP
// Helmet est composé de 15 plus petits middlewares. 
// Il apporte notemment une protection contre les attaques de type cross-site scripting et autres injections intersites, contre le reniflement de TYPE MIME, contre le clickjacking
// et supprime l’en-tête X-Powered-By  
const helmet = require("helmet");

// param
const dotenv = require('dotenv').config('../.env');

const nodemon = require('nodemon');

// déclaration des routes
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const likeRoutes = require('./routes/like');
const commentRoutes = require('./routes/comment');

// création application express
const app = express();

// ajoute helmet à l'application / ICIJCO: revoir si besoin
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// gestion des headers // ICIJCO : voir si tjs ok et si besoin ajout cors ?
app.use((req, res, next) => {
    // ressources peuvent être partagées depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // headers autorisés
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // methods autorisées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
 });

// parse les requêtes avec payload JSON et mets les données parsées (objet) dans req.body
app.use(express.json());

// pour gérer les fichiers statiques 
app.use('/images', express.static(path.join(__dirname, 'images')));

// 
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/likes', likeRoutes);
app.use('/api/v1/comments', commentRoutes);
// export pour utilisation par server.js
module.exports = app;