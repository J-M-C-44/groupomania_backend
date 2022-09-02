'use strict';

// <------------------------------------- imports --------------------------------------->
// module HTTP de node.js
const http = require('http');
//l'app
const app = require('./app');
//param
const dotenv = require('dotenv').config('../.env');

//
/**
* renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
*/
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// Si aucun port n'est fourni, on écoute sur le port 3000 par défaut
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
* recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur.
*/
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// création de l'instance de serveur
const server = http.createServer(app);

// écouteurs d'évènements consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Le serveur écoute le port précédemment défini
server.listen(port);