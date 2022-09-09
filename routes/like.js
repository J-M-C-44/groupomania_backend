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

// controllers
const likeCtrl = require('../controllers/like');

// remarque : ajout d'un like sur un post -> voir routes/post

// supression d'un like 
router.delete('/:id', authorize, likeCtrl.deleteOneLike);

module.exports = router;