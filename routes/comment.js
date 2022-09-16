// dans routes
'use strict';
// <------------------------------------- imports --------------------------------------->
// express et création router
const express = require('express');
const router = express.Router();

// middleware :
//  - authorize : pour vérifier l'authentification (via token jwt)
//  - multer: pour gérer les fichiers entrants 
//  - checkText, checkReqParamsId: contrôles d'entrées
const authorize = require("../middleware/authorize");
const multer = require('../middleware/multer-config');
const checkText = require('../middleware/checkText');
const checkReqParamsId = require('../middleware/checkReqParamsId');

// controllers
const commentCtrl = require('../controllers/comment');

// routes
// récupération du détail d'un commentaire
router.get('/:id',    authorize, checkReqParamsId,                     commentCtrl.getOneComment);
// supression d'un commentaire
router.delete('/:id', authorize, checkReqParamsId,                    commentCtrl.deleteOneComment);
// modification d'un commentaire
router.put   ('/:id', authorize, checkReqParamsId, multer, checkText, commentCtrl.modifyComment);

// remarque : voir routes/post pour --> ajout d'un commentaire sur un post, récupération des commentaires sur un post donné

module.exports = router;