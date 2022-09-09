// dans controllers
'use strict';
// <------------------------------------- imports --------------------------------------->

// param
const dotenv = require('dotenv').config('../.env');
    // console.log('dotenv : ', dotenv);
  
// mySQL - table posts
const Post = require('../models/Post')
const Like = require('../models/Like')  

// packages :





// <-------------------------------- Controller "createLike" ------------------------------->
/**
 * // ICIJCO: revoir commentaires
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
                Like.create (newLike, (error, data) => {
                    if (error) {
                        return res.status(500).json({ error })
                    }                 
                    else {
                        return res.status(201).json({ message: 'like created' })
                    }
                });
            } else {
                return res.status(403).json({ message : 'your like already exist for this post'});        
            }
        }); 
    })
};
exports.deleteOneLike = (req, res, next) => {
    console.log('deleteOnelike');
    // ICIJCO - penser à la cascade quand post, commentaires likes etc

    Like.findById(req.params.id , (error, like) => {
        if (error) {
            console.log(' pb like.findById (deleteOnLike); erreur : ', error);
            if (error.kind == 'not_found') { 
                console.log('like non trouvé'); 
                return res.status(404).json({ message: 'like not found'});
            } else 
                return res.status(500).json({ error });
        }
        // vérfication que le demandeur est bien le propriétaire du like
        if (like.userId != req.auth.userId) {
            console.log('! tentative piratage ? req.auth.userId =   ', req.auth.userId, '<> post.userId = ', post.userId  );
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