// dans routes
'use strict';
// <------------------------------------- imports --------------------------------------->
// express et création router
const express = require('express');
const router = express.Router();

// middleware :
//  - authorize : pour vérifier l'authentification (via token jwt)
//  - multer: pour gérer les fichiers entrants
//  - checkText, checkReqParamsId, checkReqQuery: contrôles d'entrées 
const authorize = require("../middleware/authorize")
const multer = require('../middleware/multer-config');
const checkText = require('../middleware/checkText');
const checkReqParamsId = require('../middleware/checkReqParamsId');
const checkReqQueryPageLimit= require('../middleware/checkReqQueryPageLimit');
const checkReqQueryUserID = require('../middleware/checkReqQueryUserID');

// controllers
const postCtrl = require('../controllers/post');
const likeCtrl = require('../controllers/like');
const commentCtrl = require('../controllers/comment');

//routes 
// création d'un post
router.post('/',                authorize,                   multer, checkText, postCtrl.createPost);
// modification d'un post
router.put('/:id',              authorize, checkReqParamsId, multer, checkText, postCtrl.modifyPost);
// récupération des posts "likés" par un user (userid à passer en parametre dans url --> ?userid)
router.get('/likes/',           authorize, checkReqQueryUserID,                 postCtrl.getAllPostsLikedbyOneUser);
// récupération du détail d'un post
router.get('/:id',              authorize, checkReqParamsId,                    postCtrl.getOnePost);
// récupération de tous les posts
router.get('/',                 authorize, checkReqQueryPageLimit,              postCtrl.getAllPostsPaginated);
//récupération des likes pour un post
router.get('/:id/likes/',       authorize, checkReqParamsId,                    likeCtrl.getAllLikesForOnePost);
// // récupération du nombre de likes pour un post
router.get('/:id/likes/count',  authorize, checkReqParamsId,                    likeCtrl.getCountLikesForOnePost);
// récupération des commentaires pour un post
router.get('/:id/comments/',    authorize, checkReqParamsId,                    commentCtrl.getAllCommentsForOnePost);
// // supression d'un post
router.delete('/:id',           authorize, checkReqParamsId,                    postCtrl.deleteOnePost);
// ajout d'un like
router.post('/:id/likes',        authorize, checkReqParamsId,                   likeCtrl.addLike);
// ajout d'un commentaire
router.post('/:id/comments',     authorize, checkReqParamsId, multer, checkText, commentCtrl.addOnecomment);


module.exports = router;