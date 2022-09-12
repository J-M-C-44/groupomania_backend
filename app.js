'use strict';

// <------------------------------------- imports --------------------------------------->
const express = require('express');  // framework d'application web pour node.js

//ICIJCO: à virer quand OK
//const connection = require('./models/db');
// mysql avec  promise : 
// const mysql = require('mysql2/promise');
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
const postRoutes = require('./routes/post');
const likeRoutes = require('./routes/like');
const commentRoutes = require('./routes/comment');

// création application express
const app = express();

// ajoute helmet à l'application / ICIJCO: revoir si besoin
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// ICIJCO : à virer quand OK
// let sql = "SELECT * FROM User" ;
// connection.query (sql, function (err, results,fields) {
//   console.log(results); // results contains rows returned by server
//   // console.log(fields); // fields contains extra meta data about results, if available
//   }
// );

//- ----------------intégrer connection mySQL avec promise
// async function connect() {
//   const connection = await mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME   
//   });
//   let sql = "SELECT * FROM User" ;
//   connection.query(sql)
//       .then( results => console.log('resultat: ', results[0]))
//       .catch( error => console.log('resultat: ', results))

// }
// connect();
//- ------------------ fin intégrer connection mySQL avec promise


console.log('ICIJCO: app.js')
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
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
// export pour utilisation par server.js
module.exports = app;