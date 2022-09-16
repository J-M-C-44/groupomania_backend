// dans controllers
'use strict';
// <------------------------------------- imports --------------------------------------->

// param
const dotenv = require('dotenv').config('../.env');
    // console.log('dotenv : ', dotenv);
  
// mySQL - table 
const Post = require('../models/Post')
const Like = require('../models/Like')  


// <-------------------------------- Controller "addLike" ------------------------------->
/**
* ajout d'un like sur un post donné 
*   - remarque : contrôle des entrées effectuées au préalable dans middlewares
*   - on vérifie que le post existe bien et qu'il n' y a pas déjà un like pour le demandeur
*   - si ok : renvoie statut 201
*   - si ko : renvoie statut 403, 404 ou 500
*/
exports.addLike = (req, res, next) => {
    console.log('addLike');

    // vérfication que le post existe bien 
    Post.findById(req.params.id , (error, post) => {
        if (error) {
            console.log(' pb post.findById (addLike); erreur : ', error);
            if (error.kind == 'not_found') { 
                return res.status(404).json({ message: 'post not found'});
            } else {
                return res.status(500).json({ error });
            }       
        }
        // vérification que le like n'existe pas déja 
        Like.findByPostIdAndUserId (post.id, req.auth.userId, (error, like) => {
            if (error) {
                console.log(' pb like.findByPostIdAndUserId (addLike); erreur : ', error); 
                return res.status(500).json({ error });
            }
            // si le like n existe pas on le crée
            if (like == 'not_found') {
                const newLike = new Like({
                    postId :    post.id,
                    userId :    req.auth.userId
                });
                Like.create (newLike, (error, createdLike) => {
                    if (error) {
                        return res.status(500).json({ error })
                    }                 
                    else {
                        return res.status(201).json(createdLike)
                    }
                });
            } else {
                return res.status(403).json({ message : 'your like already exist for this post'});        
            }
        }); 
    })
};

// <-------------------------------- Controller "getAllLikesForOnePost" ------------------------------->
/**
* récupération des likes d'un post donné
*   - si ok : renvoie statut 200 et données
*   - si ko : renvoie statut 404 ou 500
*/ 
exports.getAllLikesForOnePost = (req, res, next) => {
    console.log('getAllLikesForOnePost');
    Like.findAllByPost(req.params.id, (error, likes) => {
        if (error) {
            console.log(' pb like.findByPost (getAllLikesForOnePost); erreur : ', error);
            if (error.kind == 'not_found') { 
                console.log('like non trouvé'); 
                return res.status(404).json({ message: 'Like not found for this post'});
            } else 
                return res.status(500).json({ error });
        }
    
        res.status(200).json(likes)
    })
};

// <-------------------------------- Controller "getAllLikesForOneUser" ------------------------------->
/**
* récupération des likes d'un utilisateur donné
*   - si ok : renvoie statut 200 et données
*   - si ko : renvoie statut 404 ou 500
*/
exports.getAllLikesForOneUser = (req, res, next) => {
    console.log('getAllLikesForOneUser');
    Like.findAllByUser(req.params.id, (error, likes) => {
        if (error) {
            console.log(' pb like.findByUser (getAllLikesForOneUser); erreur : ', error);
            if (error.kind == 'not_found') { 
                console.log('like non trouvé'); 
                return res.status(404).json({ message: 'Like not found for this user'});
            } else 
                return res.status(500).json({ error });
        }
    
        res.status(200).json(likes)
    })
};

// <-------------------------------- Controller "getCountLikesForOnePost" ------------------------------->
/**
* récupération total des likes d'un post donné
*   - si ok : renvoie statut 200 et le total
*   - si ko : renvoie statut 500
*/
exports.getCountLikesForOnePost = (req, res, next) => {
    console.log('getCountLikesForOnePost');
    Like.countByPost(req.params.id, (error, countLikes) => {
        if (error) {
            console.log(' pb like.countByPost (getCountLikesForOnePost); erreur : ', error);
            return res.status(500).json({ error });
        }
    
        res.status(200).json({"countLikes" : countLikes})
    })
};

// <-------------------------------- Controller "deleteOnelike" ------------------------------->
/**
* suppression d'un like donné.
*   - seul son propriétaire et l'administrateur sont autorisés à supprimer un like
*   - si ok : renvoie statut 200
*   - si ko : renvoie statut 403, 404 ou 500
*/
exports.deleteOneLike = (req, res, next) => {
    console.log('deleteOnelike');

    Like.findById(req.params.id , (error, like) => {
        if (error) {
            console.log(' pb like.findById (deleteOnLike); erreur : ', error);
            if (error.kind == 'not_found') { 
                console.log('like non trouvé'); 
                return res.status(404).json({ message: 'like not found'});
            } else 
                return res.status(500).json({ error });
        }
        // vérfication que le demandeur est bien le propriétaire du like (sauf administrateur)
        if ( (like.userId != req.auth.userId) && !req.auth.roleIsAdmin ) {
            console.log('! tentative piratage ? req.auth.userId =   ', req.auth.userId, '<> like.userId = ', like.userId  );
            return res.status(403).json({ message : 'Not authorized'});
        }

        Like.delete (like , (error, result) => {
            if (error) {
                console.log(' pb Like.delete - erreur : ', error);                  
                return res.status(500).json({ error });
            }
            res.status(200).json({message : 'like deleted'})
        })

    });
};
