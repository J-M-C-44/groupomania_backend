// dans routes
'use strict';
// <------------------------------------- imports --------------------------------------->
// express et création router
const express = require('express');
const router = express.Router();

// middleware :
//  - authorize : pour vérifier l'authentification (via token jwt)
//  - limiter : pour limiter le nombre de connexions (parade brutforce)
//  - checkEmail : pour contrôler l'entrée email
//  - checkPassword :pour contrôler l'entrée password
//  - multer: pour gérer les fichiers entrants 
const authorize = require("../middleware/authorize")
const limiter = require("../middleware/limiter");
const multer = require('../middleware/multer-config');
const checkEmail = require("../middleware/checkEmail");
const checkPassword = require("../middleware/checkPassword");
const checkProfileData = require('../middleware/checkProfileData');
const checkReqParamsId = require('../middleware/checkReqParamsId');

// controllers
const userCtrl = require('../controllers/user');
const postCtrl = require('../controllers/post');
const commentCtrl = require('../controllers/comment');
const likeCtrl = require('../controllers/like');

// enregistrement d'un nouvel utilisateur
router.post('/signup',                     limiter.signupRate,                          checkEmail, checkPassword,  userCtrl.signup);
// connexion d'un utilisateur existant
router.post('/login',                      limiter.loginRate,                                                       userCtrl.login);
// modification du profil d'un utilisateur existant
router.put('/:id/profile',      authorize,                    checkReqParamsId, multer, checkProfileData,           userCtrl.modifyProfile);
// modification du password d'un utilisateur existant
//router.put('/:id/password',     authorize, limiter.loginRate, checkReqParamsId,                      checkPassword, userCtrl.modifyPassword);
router.patch('/:id/password',   authorize, limiter.loginRate, checkReqParamsId,                      checkPassword, userCtrl.modifyPassword);
// modification de l email d'un utilisateur existant
//router.put('/:id/email',        authorize,                    checkReqParamsId,          checkEmail,                userCtrl.modifyEmail);
router.patch('/:id/email',      authorize,                    checkReqParamsId,          checkEmail,                userCtrl.modifyEmail);
// récupération du détail d'un utilisateur
router.get('/:id',              authorize,                    checkReqParamsId,                                     userCtrl.getOneUser);
// récupération de tous les utilisateurs
router.get('/',                 authorize,                                                                          userCtrl.getAllUsers);
// récupération des posts pour un user
router.get('/:id/posts/',       authorize,                    checkReqParamsId,                                     postCtrl.getAllPostsForOneUser);
// récupération des commentaires pour un user
router.get('/:id/comments/',    authorize,                    checkReqParamsId,                                     commentCtrl.getAllCommentsForOneUser);
// récupération des likes pour un user
router.get('/:id/likes/',       authorize,                    checkReqParamsId,                                     likeCtrl.getAllLikesForOneUser);
// supression d'un utilisateur
router.delete('/:id',           authorize,                    checkReqParamsId,                                     userCtrl.deleteOneUser);

module.exports = router;