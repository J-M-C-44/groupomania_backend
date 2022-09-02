'use strict';

// <------------------------------------- imports --------------------------------------->
const express = require('express');  // framework d'application web pour node.js
// ICIJCO à virer / remplacer 
// const mongoose = require('mongoose'); // outil de modélisation d’object pour MongoDB
const path = require('path'); // permet de gérer le chemin de fichier

// Helmet : permet de sécuriser l'application express en configurant de manière appropriée les en-têtes HTTP
// Helmet est composé de 15 plus petits middlewares. 
// Il apporte notemment une protection contre les attaques de type cross-site scripting et autres injections intersites, contre le reniflement de TYPE MIME, contre le clickjacking
// et supprime l’en-tête X-Powered-By  
const helmet = require("helmet");

// ICIJCO à virer 
// Express Mongoose Sanitize : permet de se protéger des injections NoSQL dans MongoDB
// recherche et supprime (ou remplace) certains caractères spéciaux dans les clefs d'objets 
// const mongoSanitize = require('express-mongo-sanitize');

// param
const dotenv = require('dotenv').config('../.env');
const nodemon = require('nodemon');

// déclaration des routes
const userRoutes = require('./routes/user');


// création application express
const app = express();

// ajoute helmet à l'application / ICIJCO: revoir si besoin
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

//ICIJCO : intégrer connection mySQL + sequelize
// connection à mongoDB Atlas (paramètres dans .env)
// mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_NAME}.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`,
//   { useNewUrlParser: true,
//     useUnifiedTopology: true })
//   .then(() => console.log('Connexion à MongoDB OK'))
//   .catch(() => console.log('Connexion à MongoDB KO !'));

// gestion des headers // ICIJCO : voir si tjs ok et si ajout cors ?
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

//ICIJCO: à virer / remplacer par un autre utilitaire  anti injection sql ?
// ajoute express-mongo-sanitize à l'application
// app.use(mongoSanitize());

// pour gérer les fichiers statiques 
app.use('/images', express.static(path.join(__dirname, 'images')));

// 
app.use('/api/auth', userRoutes);

// export pour utilisation par server.js
module.exports = app;