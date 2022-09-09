'use strict';

// mysql2 avec callback 
const mysql = require('mysql2');
const dotenv = require('dotenv').config('../.env');

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

module.exports = connection;