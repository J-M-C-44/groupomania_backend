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
const multer = require('../middleware/multer-config');
const checkText = require('../middleware/checkText');

// controllers
const postCtrl = require('../controllers/post');
const likeCtrl = require('../controllers/like');
const commentCtrl = require('../controllers/comment');

// création d'un post
router.post('/',            authorize, multer, checkText,   postCtrl.createPost);
//ajout/suppression d'un like
router.post('/:id/like',    authorize,          checkLike,  likeCtrl.createLike);
// modification d'un post
router.put('/:id',          authorize, multer, checkText,   postCtrl.modifyPost);
// récupération du détail d'un post
router.get('/:id',          authorize,                      postCtrl.getOnePost);
// récupération de tous les posts
router.get('/',             authorize,                      postCtrl.getAllPosts);
// supression d'un utilisateur
router.delete('/:id',       authorize,                      postCtrl.deleteOnePost);

module.exports = router;