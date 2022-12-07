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



// <-------------------------------- Controller "addOnecomment" ------------------------------->
/**
* ajout d'un commentaire sur un post donné 
*   - remarque : contrôle des entrées effectuées au préalable dans middlewares
*   - on vérifie que le post existe bien
*   - si ok : renvoie statut 201
*   - si ko : renvoie statut 404 ou 500
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

// <-------------------------------- Controller "getOneComment" ------------------------------->
/**
* récupération des informations d'un commenataire donné
*   - si ok : renvoie statut 200 et données
*   - si ko : renvoie statut 404 ou 500
*/ 
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

// <-------------------------------- Controller "getAllCommentsForOnePost" ------------------------------->
/**
* récupération de l'ensemble des commenataires d'un post donné
*   - si ok : renvoie statut 200 et données
*   - si ko : renvoie statut 404 ou 500
*/ 
exports.getAllCommentsForOnePost = (req, res, next) => {
    console.log('getAllCommentsForOnePost');
    Comment.findAllByPostId(req.params.id, (error, comments) => {
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

// <-------------------------------- Controller "getAllCommentsForOneUser" ------------------------------->
/**
* récupération de l'ensemble des commentaires créés par un utilisateur donné
*   - si ok : renvoie statut 200 et données
*   - si ko : renvoie statut 404 ou 500
*/ 
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
// <-------------------------------- Controller "modifyComment" ------------------------------->
/**
* modification des informations d'un commentaire donné.
*   - remarque : contrôle des entrées efffectué au préalable dans middleware
*   - seul son propriétaire et l'administrateur sont autorisés à modifier le commentaire 
*   - si ok : renvoie statut 200 (et on supprime l'ancien fichier le cas échéant)
*   - si ko : renvoie statut 403, 404 ou 500 (et on supprime le fichier transmis le cas échéant)
*/
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
        // if (!req.file) {
        //     commentObject.imageUrl = comment.imageUrl;
        // };
        // sans nouveau fichier image transmis et sans demande de suppression de l'image, on conserve l'URL initiale 
        let oldImageToDelete = false
        if (req.file) {
            oldImageToDelete = true 
        } else {
            if (commentObject.imageUrl && commentObject.imageUrl == 'toDelete') {
                oldImageToDelete = true;
                commentObject.imageUrl = null;   
            } else {
                commentObject.imageUrl = comment.imageUrl;
            }
        }
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
            if (comment.imageUrl != null && oldImageToDelete ) {
                const oldFilename = comment.imageUrl.split("/images/post/")[1];
                removeImageFile(oldFilename);      
            }
            let body = {};
            if (req.file) {
                body =  {message : 'comment modified', imageUrl : commentObject.imageUrl }
            } else {
                body =  {message : 'comment modified' }
            }
            res.status(200).json(body)
        })
    }); 
} 

// <-------------------------------- Controller "deleteOneComment" ------------------------------->
/**
* suppression d'un commentaire donné.
*   - seul son propriétaire et l'administrateur sont autorisés à supprimer un commentaire
*   - si ok : renvoie statut 200
*   - si ko : renvoie statut 403, 404 ou 500
*/
exports.deleteOneComment = (req, res, next) => {
    console.log('deleteOnecomment');

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