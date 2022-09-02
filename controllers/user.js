'use strict';
// <------------------------------------- imports --------------------------------------->
//ICIJCO à compléter
// models
//const User = require('../models/user');

// param
const dotenv = require('dotenv').config('../.env');
    // console.log('dotenv : ', dotenv);
    
// packages :
//   - bcrypt : pour hasher le mot de passe du nouvel utilisateur
//   - jwt : pour attribuer un token à l'utilisateur quand il se connecte
//   - cryptojs : pour crypter l'adresse email dans la BDD
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');  
const cryptojs = require("crypto-js");


// <-------------------------------- Controller "signup" ------------------------------->
/**
 * // ICIJCO: revoir commentaires
* enregistrement d'un nouvel utilisateur à partir de l'email et password fournis
*   - remarque : contrôle des entrées effectuées au préalable dans le middlewares checkEmail.js et checkPassword.js
*   - haschage du mot de passe (bcrypt)
*   - encryptage de l'adresse email (cryptojs)
*   - création enregistrements dans la BDD User  
*   - si ok : renvoie statut 201
*   - si ko : renvoie statut 400 ou 500
*/
exports.signup = (req, res, next) => {
     console.log('signup');
    // haschage du mot de passe par bcrypt
    const rounds = Number(process.env.HASH_NUMBER)
    bcrypt.hash(req.body.password, rounds)
        // création de l'enregistrement user dans la BDD User + retour réponse
        .then(hash => {
             console.log('hash: ', hash);
            // encryptage de l'adresse email / RGPD 
            const cryptedEmail = cryptojs.HmacSHA512(req.body.email, `${process.env.CRYPTOJS_SECRET_KEY}`).toString();
            console.log('cryptedEmail: ', cryptedEmail);
            const user = new User({
                email: cryptedEmail,
                password: hash
            });
            console.log('user: ', user);
            //ICICJO 
            // user.save()
            //     .then(() => res.status(201).json({ message: 'user created' }))
            //     .catch(error => res.status(400).json({ error }));
            res.status(201).json({ message: 'user created' })
        })
        .catch(error => res.status(500).json({ error }));
};


// <-------------------------------- Controller "login" -------------------------------->
/**
 *  * // ICIJCO: revoir commentaires
* connexion d'un utilisateur à partir de l'email et password fournis
*   - remarque : contrôle des entrées effectuées au préalable dans le middlewares checkEmail.js et checkPassword.js
*   - recherche de l'enregistrement dans la BDD User en utilisant l'email (préalablement crypté)
*   - verification que le mot de passe et le hash dans BDD User correspondent  
*   - si ok : renvoie statut 201 avec un token chiffré contenant le userID (jwt)
*   - si ko : renvoie statut 400, 401 ou 500
*/
exports.login = (req, res, next) => {
    console.log('login : ', req.body.email);

    // recherche de l'enregistrement dans la BDD User en utilisant l'email (préalablement crypté)
    const cryptedEmail = cryptojs.HmacSHA512(req.body.email, `${process.env.CRYPTOJS_SECRET_KEY}`).toString();
    // ICIJCO : remplacer avec mysql
    // User.findOne({ email: cryptedEmail })
    //     .then(user => {
    //         if (user === null) {
    //             console.log('user non trouvé'); 
    //             return res.status(401).json({ message: 'Incorrect username/password pair'});
    //         }
    //         // verification que le mot de passe et le hash dans BDD User correspondent, et on renvoie un Token chiffré
    //         bcrypt.compare(req.body.password, user.password)
    //             .then(valid => {
    //                 if (!valid) {
    //                     // console.log('user trouvé mais mots de passe différents'); 
    //                     return res.status(401).json({ message: 'Incorrect username/password pair' });
    //                 }
                    res.status(200).json({
                        userId: user._id,
                        // on crée le token contenant le userId avec jwt
                        token: jwt.sign(
                           { userId: user._id },
                           process.env.TOKEN_SECRET,
                           { expiresIn: '24h' }
                        )
                    });
    //             })
    //             // si pb avec bcrypt
    //             .catch(error => res.status(500).json({ error }));
    //     })
        // // si pb recherche bdd User
        // .catch(error => res.status(400).json({ error }));

};