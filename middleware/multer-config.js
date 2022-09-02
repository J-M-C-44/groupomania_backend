'use strict';

// <------------------------------------ imports -------------------------------------->
// package :
//  multer : permet de gérer les fichiers entrants dans les requêtes HTTP
//  path : module node.js gérant le "path"
//  uuid : permet de créer un identifiant unique
const multer = require('multer');
const path = require("path");
const uuid = require ('uuid');

// les différents type MIME acceptés 
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/bmp': 'bmp',
  'image/gif': 'gif',
  'image/webp': 'webp'
};
// enregistrement fichier dans dossier images sous la forme timestamp +id unique . extension (mimetype)
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    const fullname = Date.now() + '-' + uuid.v4().replace(/-/g, "")+ '.' + extension
    callback(null, fullname );
  }
});

// on ne prend en charge que les fichiers avec des formats autorisés
const fileFilter = (req, file, callback) => {
    const testMimeType = MIME_TYPES[file.mimetype];
    if (testMimeType != undefined) {
        //  console.log('mimetype ok : ', file.mimetype );
        callback(null, true);
    } else {
        console.log('mimetype ko : ', file.mimetype );
        console.log('req.fileValidationError : ', req.fileValidationError );
        callback(new Error('unsupported image format')) 
    }
};

// on limite la taille du fichier à 2 Mo 
const limits = { fileSize: 2097152 };

// <------------------------------ Middleware "multer" ----------------------------->
/**
* gére les fichiers entrants dans les requêtes HTTP
*   - limitation taille du fichier à 2 Mo
*   - vérifie que le type de fichier est valide 
*   - sauvegarde dans dossier images 
*/
module.exports = multer({storage: storage, limits: limits, fileFilter: fileFilter}).single('image');