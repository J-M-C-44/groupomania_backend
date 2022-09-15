// dans routes
'use strict';
// <------------------------------------- imports --------------------------------------->
// express et création router
const express = require('express');
const router = express.Router();
// middleware :
//  - authorize : pour vérifier l'authentification (via token jwt)
//  - multer: pour gérer les fichiers entrants 
const authorize = require("../middleware/authorize")
const checkReqParamsId = require('../middleware/checkReqParamsId');

// controllers
const likeCtrl = require('../controllers/like');

// remarque :  voir routes/post pour -> ajout d'un like sur un post, récupération des likes sur un post donné

// supression d'un like 
router.delete('/:id', authorize, checkReqParamsId, likeCtrl.deleteOneLike);

module.exports = router;