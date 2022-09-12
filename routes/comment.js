// dans routes
'use strict';
// <------------------------------------- imports --------------------------------------->
// express et création router
const express = require('express');
const router = express.Router();
// middleware :
//  - authorize : pour vérifier l'authentification (via token jwt)
//  - multer: pour gérer les fichiers entrants 
const authorize = require("../middleware/authorize");
const multer = require('../middleware/multer-config');
const checkText = require('../middleware/checkText');

// controllers
const commentCtrl = require('../controllers/comment');

// remarque : voir routes/post pour --> ajout d'un commentaire sur un post, récupération des commenataires sur un post donné

// récupération du détail d'un commentaire
router.get('/:id',              authorize,                      commentCtrl.getOneComment);
// // récupération de tous les commentaires pour un post
// router.get('/',              authorize,                      getAllCommentsForOnePost);
// supression d'un commentaire
router.delete('/:id', authorize,                    commentCtrl.deleteOneComment);
// modification d'un commentaire
router.put   ('/:id', authorize, multer, checkText, commentCtrl.modifyComment);

module.exports = router;