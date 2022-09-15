// dans controllers
'use strict';
// <------------------------------------- imports --------------------------------------->

// param
const dotenv = require('dotenv').config('../.env');
    // console.log('dotenv : ', dotenv);
  
// mySQL - table posts
const Post = require('../models/Post') 
const Comment = require('../models/Comment') 
// 
// fonction mutualisée de suppression de fichier
const removeImageFile = require('../utils/removeFile');



// <-------------------------------- Controller "createComment" ------------------------------->
/**
 * // ICIJCO: revoir commentaires
*/
exports.addOnecomment = (req, res, next) => {
    console.log('addComment');

    // vérfication que le post existe bien 
    Post.findById(req.params.id , (error, post) => {
        if (error) {
            console.log(' pb post.findById (addComment); erreur : ', error);
            if (error.kind == 'not_found') { 
                return res.status(404).json({ message: 'post not found'});
            } else {
                return res.status(500).json({ error });
            }       
        }
        
        // récupération des données dans la requete
        const commentObject = req.file ? {
                ...JSON.parse(req.body.comment),
                imageUrl: `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`
            } : { ...req.body }

        const newComment = new Comment({
            postId :    post.id,
            userId :    req.auth.userId,
            text :      commentObject.text,
            imageUrl:   commentObject.imageUrl,
        });

        // insertion dans la BDD comments
        Comment.create (newComment, (error, createdComment) => {
            if (error) {
                if (req.file) { 
                    removeImageFile(req.file.filename);
                }
                return res.status(500).json({ error })
            }                 
            else {
                return res.status(201).json(createdComment)
            }
        });

    })
};


exports.getOneComment = (req, res, next) => {
    console.log('getOneComment');

    // recherche de l'enregistrement demandé en BDD comment  
    Comment.findById(req.params.id , (error, comment) => {

        if (error) {
            console.log(' pb comment.findById (getOneComment); erreur : ', error);
            if (error.kind == 'not_found') { 
                console.log('commentaire non trouvé'); 
                return res.status(404).json({ message: 'comment not found'});
            } else 
                return res.status(500).json({ error });
        }
    
            res.status(200).json(comment)
    })
}; 


exports.getAllCommentsForOnePost = (req, res, next) => {
    console.log('getAllCommentsForOnePost');
    // ICIJCO : remplacer post par postID
    Comment.findAllByPost(req.params.id, (error, comments) => {
        if (error) {
            console.log(' pb comment.findByPost (getAllCommentsForOnePost); erreur : ', error);
            if (error.kind == 'not_found') { 
                console.log('commentaire non trouvé'); 
                return res.status(404).json({ message: 'comment not found for this post'});
            } else 
                return res.status(500).json({ error });
        }
    
        res.status(200).json(comments)
    })
};


exports.getAllCommentsForOneUser = (req, res, next) => {
    console.log('getAllCommentsForOnePost');
    Comment.findAllByUser(req.params.id, (error, comments) => {
        if (error) {
            console.log(' pb comment.findByUser (getAllCommentsForOneUser); erreur : ', error);
            if (error.kind == 'not_found') { 
                console.log('commentaire non trouvé'); 
                return res.status(404).json({ message: 'comment not found for this user'});
            } else 
                return res.status(500).json({ error });
        }
    
        res.status(200).json(comments)
    })

};

exports.modifyComment = (req, res, next) => {
    console.log('modifyComment');
    // récupération des données dans la requete
    const commentObject = req.file ? {
            ...JSON.parse(req.body.comment),
            imageUrl: `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`
        } : { ...req.body }

    // recherche de l'enregistrement demandé en BDD comment  
    Comment.findById(req.params.id , (error, comment) => {

        if (error) {
            console.log(' pb comment.findById (modifyComment); erreur : ', error);
            // si pb, on fait retour arrière sur l'éventuel fichier transmis
            if (req.file) { 
                removeImageFile(req.file.filename);
            }
            if (error.kind == 'not_found') { 
                console.log('commentaire non trouvé'); 
                return res.status(404).json({ message: 'comment not found'});

            } else 
                return res.status(500).json({ error });
        }

        // vérfication que le demandeur est bien le propriétaire du commentaire (sauf administrateur)
        if ( (comment.userId != req.auth.userId) && !req.auth.roleIsAdmin ) {
            console.log('! tentative piratage ? comment.userId = ', comment.userId, ' <> req.auth.userId =   ', req.auth.userId);
            // on fait retour arrière sur l'éventuel fichier transmis
            if (req.file) { 
                removeImageFile(req.file.filename);
            };
            return res.status(403).json({ message : 'Not authorized'});
        }

        // mise à jour de l'enregistrement demandé en BDD comments 
        // sans nouveau fichier image transmis, on conserve l'URL initiale 
        if (!req.file) {
            commentObject.imageUrl = comment.imageUrl;
        };
        commentObject.id = req.params.id ;
 
        Comment.update(commentObject , (error, result) => {
    
            if (error) {
                console.log(' pb comment.update - erreur : ', error);
                // si pb, on fait retour arrière sur l'éventuel fichier transmis
                if (req.file) { 
                    removeImageFile(req.file.filename);
                } 
                return res.status(500).json({ error });
            }
            // delete fichier précédent si besoin
            if ( (req.file)  && (comment.imageUrl != null) ) {
                const oldFilename = comment.imageUrl.split("/images/post/")[1];
                removeImageFile(oldFilename);      
            }
            res.status(200).json({message : 'comment modified'})
        })
    }); 
} 


exports.deleteOneComment = (req, res, next) => {
    console.log('deleteOnecomment');
    // ICIJCO - penser à la cascade quand post, commentaires likes etc

    Comment.findById(req.params.id , (error, comment) => {
        if (error) {
            console.log(' pb comment.findById (deleteOnComment); erreur : ', error);
            if (error.kind == 'not_found') { 
                console.log('comment non trouvé'); 
                return res.status(404).json({ message: 'comment not found'});
            } else 
                return res.status(500).json({ error });
        }
        // vérfication que le demandeur est bien le propriétaire du commentaire (sauf administrateur)
        if ( (comment.userId != req.auth.userId) && !req.auth.roleIsAdmin ) {
            console.log('! tentative piratage ? req.auth.userId =   ', req.auth.userId, '<> comment.userId = ', comment.userId  );
            return res.status(403).json({ message : 'Not authorized'});
        }

        Comment.delete (comment , (error, result) => {
            if (error) {
                console.log(' pb comment.delete - erreur : ', error);                  
                return res.status(500).json({ error });
            }
            // on supprime le fichier image si il existe
            if ( comment.imageUrl != null ) {
                const oldFilename = comment.imageUrl.split("/images/post/")[1];
                removeImageFile(oldFilename);      
            }
            res.status(200).json({message : 'comment deleted'})
        })

    });
};