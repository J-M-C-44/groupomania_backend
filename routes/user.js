// dans routes
'use strict';
// <------------------------------------- imports --------------------------------------->
// express et création router
const express = require('express');
const router = express.Router();

// middleware :
//  - limiter : pour limiter le nombre de connexions (parade brutforce)
//  - checkEmail : pour contrôler l'entrée email
//  - checkPassword :pour contrôler l'entrée password
const limiter = require("../middleware/limiter");
const checkEmail = require("../middleware/checkEmail");
const checkPassword = require("../middleware/checkPassword");

// controllers
const userCtrl = require('../controllers/user');

// enregistrement d'un nouvel utilisateur
router.post('/signup',  limiter.signupRate, checkEmail, checkPassword,  userCtrl.signup);
// connexion d'un utilisateur existant
router.post('/login',   limiter.loginRate,                              userCtrl.login);

module.exports = router;