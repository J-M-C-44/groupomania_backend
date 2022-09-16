'use strict';
//  

// <------------------------------------- imports --------------------------------------->
// param
const dotenv = require('dotenv').config('../.env');

// mysql2 avec callback 
const mysql = require('mysql2');

// <-------------------------- gestion des connections à MySQl -------------------------->

//intégrer connection mySQL avec callback
 const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME   
});
connection.connect(error => {
  if (error) {
    console.log('Connexion à DB SQL KO !');
    throw error;
  };
  console.log("Connexion à DB SQL OK");
});

//- ---------------- pour intégrer connection mySQL avec promise
// const mysql = require('mysql2/promise');
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

module.exports = connection;