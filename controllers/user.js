// dans controllers
'use strict';
// <------------------------------------- imports --------------------------------------->

// param
const dotenv = require('dotenv').config('../.env');
    // console.log('dotenv : ', dotenv);

// mySQL - table users
const User = require('../models/user')
     
// packages :
//   - bcrypt : pour hasher le mot de passe du nouvel utilisateur
//   - jwt : pour attribuer un token à l'utilisateur quand il se connecte
//   - cryptojs : pour crypter l'adresse email dans la BDD
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');  
//const cryptojs = require("crypto-js");
// fonction mutualisée de suppression de fichier
const removeImageFile = require('../utils/removeFile');
const Post = require('../models/Post')
const Comment = require('../models/Comment')

// <-------------------------------- Controller "signup" ------------------------------->
/**
 * // ICIJCO: revoir commentaires
* enregistrement d'un nouvel utilisateur à partir de l'email et password fournis
*   - remarque : contrôle des entrées effectuées au préalable dans le middlewares checkEmail.js et checkPassword.js
*   - haschage du mot de passe (bcrypt)
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
            // const cryptedEmail = cryptojs.HmacSHA512(req.body.email, `${process.env.CRYPTOJS_SECRET_KEY}`).toString();
            // console.log('cryptedEmail: ', cryptedEmail);
            const user = new User({
                // email: cryptedEmail,
                 email: req.body.email,
                password: hash,
                role : 0
            });
            User.create(user, (error, createdUser) => {
                if (error) {
                    if (error.errno == 1062) 
                        res.status(400).json({ message: 'signup aborted, invalid email' })

                    else 
                        res.status(500).json({ message: 'signup aborted, internal error' })
                    ;
                }                 
                else {
                    //console.log('data : ', createdUser);
                    res.status(201).json({ message: 'user created', id : createdUser.id })
                }
              });
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
*   - si ok : renvoie statut 201 avec un token chiffré contenant le userId (jwt)
*   - si ko : renvoie statut 400, 401 ou 500
*/
exports.login = (req, res, next) => {
    console.log('login : ', req.body.email);

    // recherche de l'enregistrement dans la BDD User en utilisant l'email (préalablement crypté)
    //const cryptedEmail = cryptojs.HmacSHA512(req.body.email, `${process.env.CRYPTOJS_SECRET_KEY}`).toString();
    //User.findByEmail (cryptedEmail , (error, user) => {
    User.findByEmail (req.body.email , (error, user) => {
        if (error) {
            if (error.kind == 'not_found') { 
                console.log('user non trouvé'); 
                return res.status(401).json({ message: 'Incorrect username/password pair'});

            } else 
                return res.status(500).json({ error })
            ;
        } else {
            // verification que le mot de passe et le hash dans BDD User correspondent, et on renvoie un Token chiffré
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        // console.log('user trouvé mais mots de passe différents'); 
                        return res.status(401).json({ message: 'Incorrect username/password pair' });
                    }
                    res.status(200).json({
                        id:         user.id,
                        lastname:   user.lastname,
                        firstname : user.firstname,
                        fonction :  user.fonction,
                        avatarUrl : user.avatarUrl,
                        role :      user.role,
                        // on crée le token contenant le userId avec jwt
                        token: jwt.sign(
                            { userId: user.id, userRole : user.role },
                            process.env.TOKEN_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                })
                // si pb avec bcrypt
                .catch(error => res.status(500).json({ error }));
        }
    });

};

exports.getOneUser= (req, res, next) => {
    console.log('getOneUser');
   
    // recherche de l'enregistrement demandé en BDD user 
        User.findById(req.params.id , (error, user) => {

            if (error) {
                console.log('pb user.findById (getOneUser) erreur : ', error);
                if (error.kind == 'not_found') { 
                    console.log('user non trouvé'); 
                    return res.status(404).json({ message: 'user not found'});
    
                } else 
                    return res.status(500).json({ error });
            }
            // on supprime les données sensibles
            delete user.email ;
            delete user.password; 
            delete user.role ;
            res.status(200).json(user)
        });   
};

exports.getAllUsers= (req, res, next) => {
    console.log('getAllUsers');
   
    // recherche de l'enregistrement demandé en BDD user 
        User.findAll( (error, users) => {

            if (error) {
                console.log('pb user.findAll -  erreur : ', error);
                if (error.kind == 'not_found') { 
                    console.log('users non trouvés'); 
                    return res.status(404).json({ message: 'users not found'});
    
                } else 
                    return res.status(500).json({ error });
            }
            // on supprime les données sensibles
            for (let user of users) {
                delete user.email ;
                delete user.password; 
                delete user.role ;
            }
            res.status(200).json(users)
        });   
};


exports.modifyProfile= (req, res, next) => {
    console.log('modifyProfile');
   // récupération de l'objet user 
    const userObject = req.file ? {
            ...JSON.parse(req.body.user),
            avatarUrl: `${req.protocol}://${req.get('host')}/images/user/${req.file.filename}`
        } : { ...req.body };
    

    // pré-contrôle : le userID fourni doit correspondre à celui qui fait la demande
    if (( (userObject.id != req.auth.userId) || (req.params.id != req.auth.userId)) && !req.auth.roleIsAdmin ) {
        console.log('! tentative piratage ? userObject.id = ', userObject.id, ' <> req.auth.userId =   ', req.auth.userId, '<> req.params.id = ', req.params.id  );
        // on fait retour arrière sur l'éventuel fichier transmis
        if (req.file) { 
            removeImageFile(req.file.filename, 'user');
        };
        return res.status(403).json({ message : 'Not authorized'});

    } else {
    // recherche de l'enregistrement demandé en BDD user 
        User.findById(req.params.id , (error, user) => {

            if (error) {
                console.log(' pb user.findById (modifyProfile); erreur : ', error);
                // si pb, on fait retour arrière sur l'éventuel fichier transmis
                if (req.file) { 
                    removeImageFile(req.file.filename, 'user');
                }
                if (error.kind == 'not_found') { 
                    console.log('user non trouvé'); 
                    return res.status(404).json({ message: 'user not found'});
    
                } else 
                    return res.status(500).json({ error });
            }
            
            // mise à jour de l'enregistrement demandé en BDD user 
            // sans nouveau fichier image transmis, on conserve l'URL initiale 
            // if (!req.file) {
            //     userObject.avatarUrl = user.avatarUrl;
            // };

            // sans nouveau fichier image transmis et sans demande de suppression de l'image, on conserve l'URL initiale 
            let oldAvatarToDelete = false
            if (req.file) {
                oldAvatarToDelete = true 
            } else {
                if (userObject.avatarUrl && userObject.avatarUrl == 'toDelete') {
                    oldAvatarToDelete = true;
                    userObject.avatarUrl = null;   
                } else {
                    userObject.avatarUrl = user.avatarUrl;
                }
            }


            User.updateProfile (userObject , (error, result) => {
        
                if (error) {
                    console.log(' pb user.updateProfile - erreur : ', error);
                    // si pb, on fait retour arrière sur l'éventuel fichier transmis
                    if (req.file) { 
                        removeImageFile(req.file.filename, 'user');
                    } 
                    return res.status(500).json({ error });
                }
                // delete fichier précédent si besoin
                if (user.avatarUrl != null && oldAvatarToDelete ) {
                // if ( (req.file)  && (user.avatarUrl != null) ) {
                    const oldFilename = user.avatarUrl.split("/images/user/")[1];
                    removeImageFile(oldFilename, 'user');      
                }
                res.status(200).json({message : 'user modified'})
            })
        });   
    }
};



exports.modifyPassword = (req, res, next) => {
    console.log('modifyPassword');
    if (req.params.id != req.auth.userId) {
        console.log('! tentative piratage ? req.auth.userId =   ', req.auth.userId, '<> req.params.id = ', req.params.id  );
        return res.status(403).json({ message : 'Not authorized'});

    } else {
        User.findById(req.params.id , (error, user) => {

            if (error) {
                console.log(' pb user.findById (modifyPassword); erreur : ', error);
                if (error.kind == 'not_found') { 
                    console.log('user non trouvé'); 
                    return res.status(404).json({ message: 'user not found'});
                } else 
                    return res.status(500).json({ error });
            }
            // on vérifie que l'ancien mot de passe est correct 
            bcrypt.compare(req.body.oldPassword, user.password)
                .then(valid => {
                    if (!valid) {
                         console.log('user trouvé mais mots de passe différents'); 
                        throw ({ message: 'Not authorized, verify old password' })
                        //return res.status(403).json({ message: 'Not authorized, verify old password' });
                        // ICIJCO !- revoir gestion res.status ?
                        // res.status(403).json({ message: 'Not authorized, verify old password' });
                        // throw error ;
                    }
                    const rounds = Number(process.env.HASH_NUMBER)
                    return bcrypt.hash(req.body.password, rounds)
                    
                })
                // MAJ BDD User avec le nv password hashé + retour réponse
                .then(hash => {
                    user.password = hash
                    User.updatePassword (user , (error, result) => {
                        if (error) {
                            console.log(' pb user.updatepPassword - erreur : ', error);
                            return res.status(500).json({ error });
                        }
                        res.status(200).json({message : 'password modified'})
                    })
                })
               
                // si pb avec bcrypt
                .catch(error => res.status(500).json({ error }));
            
        });
    };
};


exports.modifyEmail = (req, res, next) => {
    console.log('modifyEmail');
    if ((req.params.id != req.auth.userId) && !req.auth.roleIsAdmin ) {
        console.log('! tentative piratage ? req.auth.userId =   ', req.auth.userId, '<> req.params.id = ', req.params.id  );
        return res.status(403).json({ message : 'Not authorized'});

    } else {
        User.findById(req.params.id , (error, user) => {
            if (error) {
                console.log(' pb user.findById (modifyPassword); erreur : ', error);
                if (error.kind == 'not_found') { 
                    console.log('user non trouvé'); 
                    return res.status(404).json({ message: 'user not found'});
                } else 
                    return res.status(500).json({ error });
            }
            // encryptage de l'adresse email / RGPD 
            //const cryptedEmail = cryptojs.HmacSHA512(req.body.email, `${process.env.CRYPTOJS_SECRET_KEY}`).toString();
            //user.email = cryptedEmail
            user.email = req.body.email;
            User.updateEmail (user , (error, result) => {
                if (error) {
                    console.log(' pb user.updatepEmail - erreur : ', error);
                    if (error.errno == 1062) 
                        return res.status(400).json({ message: 'email modification aborted, invalid email (duplic)' })
                    else                  
                        return res.status(500).json({ error });
                }
                res.status(200).json({message : 'Email modified'})
            })

        });
    };
};



exports.deleteOneUser = (req, res, next) => {
    console.log('deleteOneUser');
    // ICIJCO : mettre contrôle id en middleware ?
    if ((req.params.id != req.auth.userId) && !req.auth.roleIsAdmin ) {
        console.log('! tentative piratage ? req.auth.userId =   ', req.auth.userId, '<> req.params.id = ', req.params.id  );
        return res.status(403).json({ message : 'Not authorized'});

    } else {
        User.findById(req.params.id, async (error, user) => {
            if (error) {
                console.log(' pb user.findById (deleteOneUser); erreur : ', error);
                if (error.kind == 'not_found') { 
                    console.log('user non trouvé'); 
                    return res.status(404).json({ message: 'user not found'});
                } else 
                    return res.status(500).json({ error });
            }
            // la suppression du user va déclencher la supression des posts, likes et commentaires correspondants (via la cascade SQL). 
            // Par contre les fichiers images des posts et commentaires ne seront pas supprimés automatiquement, 
            //  --> il faut récupérer leurs noms en BDD pour pouvoir les supprimer après.
            let imagesFiles = await retrieveImagesFilesPostsAndComments(user.id)
            console.log('ImagesFiles2 : ', imagesFiles)
            // on supprime de la bdd
            User.delete (user , (error, result) => {
                if (error) {
                    console.log(' pb user.delete - erreur : ', error);                  
                    return res.status(500).json({ error });
                }
                if ( user.avatarUrl != null ) {
                    const oldFilename = user.avatarUrl.split("/images/user/")[1];
                    removeImageFile(oldFilename, 'user');      
                }
                // suppression des fichiers "en cascade"
                for (let imageUrl of imagesFiles) {
                    let oldFilename = imageUrl.split("/images/post/")[1];
                    removeImageFile(oldFilename)
                }
                res.status(200).json({message : 'user deleted'})
            })
        })          
    };
};


function retrieveImagesFilesPostsAndComments (userId) {
   
     return new Promise((resolve, reject) => {
        Post.findAllImagesByUserId(userId, (error, ImagesFilesonPostByUser) => {
            if (error) {
                console.log(' pb findAllImagesByUserId (deleteOnPost); erreur : ', error);
                reject([]);
            }
            
            Comment.findAllImagesByUserId(userId, (error, ImagesFilesonCommentbyUser) => {
                if (error) {
                    console.log(' pb findAllImagesByUserId (deleteOnPost); erreur : ', error);
                    reject([]);
                }
                Comment.findAllImagesOnPostbyUserId(userId, (error, ImagesFilesCommentonPostByUser) => {
                    if (error) {
                        console.log(' pb findAllImagesOnPostbyUserId (deleteOnPost); erreur : ', error);
                        reject([]);
                    }
                    //on concatene tous les resultats de requetes
                    const ImagesFilesPostsAndComments = [].concat(ImagesFilesonPostByUser, ImagesFilesonCommentbyUser, ImagesFilesCommentonPostByUser)
                    // on ne garde que la valeur de l'imageUrl
                    let newArray = []
                    for (let item of ImagesFilesPostsAndComments) {
                        newArray.push(item.imageUrl)
                    }
                    // on dédoublonne 
                    const ImagesFiles = [...new Set(newArray)]
                    resolve(ImagesFiles);

                });
            });
        });
     })
};