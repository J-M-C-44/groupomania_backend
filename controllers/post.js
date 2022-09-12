// dans controllers
'use strict';
// <------------------------------------- imports --------------------------------------->

// param
const dotenv = require('dotenv').config('../.env');
    // console.log('dotenv : ', dotenv);
  
// mySQL - table posts
const Post = require('../models/Post')
   
// packages :
// fonction mutualisée de suppression de fichier
const removeImageFile = require('../utils/removeFile');




// evaluatePost;

// <-------------------------------- Controller "createPost" ------------------------------->
/**
 * // ICIJCO: revoir commentaires
*/
exports.createPost = (req, res, next) => {
    console.log('createPost');
    // récupération des données dans la requete
    const postObject = req.file ? {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`
        } : { ...req.body }

    const post = new Post({
        userId :    req.auth.userId,
        text :      postObject.text,
        imageUrl:   postObject.imageUrl,
    });

    Post.create(post, (error, createdPost) => {
        if (error) {
            if (req.file) { 
                removeImageFile(req.file.filename);
            }
            res.status(500).json({ error })
        }                 
        else {
            res.status(201).json(createdPost)
        }
        });
};

exports.modifyPost = (req, res, next) => {
    console.log('modifyPost');
    // récupération des données dans la requete
    const postObject = req.file ? {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`
        } : { ...req.body }

    // recherche de l'enregistrement demandé en BDD post  
    Post.findById(req.params.id , (error, post) => {

        if (error) {
            console.log(' pb post.findById (modifyPost); erreur : ', error);
            // si pb, on fait retour arrière sur l'éventuel fichier transmis
            if (req.file) { 
                removeImageFile(req.file.filename);
            }
            if (error.kind == 'not_found') { 
                console.log('post non trouvé'); 
                return res.status(404).json({ message: 'post not found'});

            } else 
                return res.status(500).json({ error });
        }

        // vérfication que le demandeur est bien le propriétaire du post (sauf administrateur)
        if ((post.userId != req.auth.userId) && !req.auth.roleIsAdmin ) {
            console.log('! tentative piratage ? post.userId = ', post.userId, ' <> req.auth.userId =   ', req.auth.userId);
            // on fait retour arrière sur l'éventuel fichier transmis
            if (req.file) { 
                removeImageFile(req.file.filename);
            };
            return res.status(403).json({ message : 'Not authorized'});
        }

        // mise à jour de l'enregistrement demandé en BDD posts 
        // sans nouveau fichier image transmis et sans demande de suppression de l'image, on conserve l'URL initiale 
        let oldImageToDelete = false
        if (req.file) {
            oldImageToDelete = true 
        } else {
            if (postObject.imageUrl && postObject.imageUrl == 'toDelete') {
                oldImageToDelete = true;
                postObject.imageUrl = null;   
            } else {
                postObject.imageUrl = post.imageUrl;
            }
        }
        //ICIJCO : faire ménage qu OK
        // if (!req.file) {
        //     postObject.imageUrl = post.imageUrl;
        // };
        postObject.id = req.params.id ;
 
        Post.update(postObject , (error, result) => {
    
            if (error) {
                console.log(' pb post.update - erreur : ', error);
                // si pb, on fait retour arrière sur l'éventuel fichier transmis
                if (req.file) { 
                    removeImageFile(req.file.filename);
                } 
                return res.status(500).json({ error });
            }
            console.log('postObject.imageUrl : ', postObject.imageUrl)

            // delete fichier précédent si besoin
            if (post.imageUrl != null && oldImageToDelete ) {
                const oldFilename = post.imageUrl.split("/images/post/")[1];
                removeImageFile(oldFilename);      
            }

            res.status(200).json({message : 'post modified'})
        })
    }); 
} 
        
exports.getOnePost = (req, res, next) => {
    console.log('getOnePost');
    // recherche de l'enregistrement demandé en BDD post  
    Post.findById(req.params.id , (error, post) => {

        if (error) {
            console.log(' pb post.findById ; erreur : ', error);
            if (error.kind == 'not_found') { 
                console.log('post non trouvé'); 
                return res.status(404).json({ message: 'post not found'});
            } else 
                return res.status(500).json({ error });
        }

        res.status(200).json(post)
    }); 
} 


exports.getAllPostsForOneUser = (req, res, next) => {
    console.log('getAllPostsForOneUser');
    // recherche des enregistrements en BDD post pour le user demandé 
    Post.findAllByUserId(req.params.id , (error, posts) => {

        if (error) {
            console.log(' pb Post.findAllByUserId (getAllPostsForOneUser); erreur : ', error);
            if (error.kind == 'not_found') { 
                console.log('post non trouvé'); 
                return res.status(404).json({ message: 'post not found'});
            } else 
                return res.status(500).json({ error });
        }

        res.status(200).json(posts)
    }); 
} 

exports.getAllLikedPostsForOneUser = (req, res, next) => {
    console.log('getAllLikedPostsForOneUser');
    // recherche des enregistrements en BDD post et like pour le user demandé 
    Post.findAllLikedByUserId(req.params.id , (error, posts) => {

        if (error) {
            console.log(' pb Post.findAllLikedByUserId (getAllLikedPostsForOneUser); erreur : ', error);
            if (error.kind == 'not_found') { 
                console.log('post non trouvé'); 
                return res.status(404).json({ message: 'post not found'});
            } else 
                return res.status(500).json({ error });
        }

        res.status(200).json(posts)
    }); 
} 


exports.getAllPosts = (req, res, next) => {
    console.log('getAllPosts');
    // recherche de l'enregistrement demandé en BDD post  
    Post.findAll( (error, posts) => {

        if (error) {
            console.log(' pb post.findAll; erreur : ', error);
            // si pb, on fait retour arrière sur l'éventuel fichier transmis
            if (req.file) { 
                removeImageFile(req.file.filename);
            }
            if (error.kind == 'not_found') { 
                console.log('post non trouvé'); 
                return res.status(404).json({ message: 'post not found'});

            } else 
                return res.status(500).json({ error });
        }

        res.status(200).json(posts)
    }); 
} 


exports.deleteOnePost = (req, res, next) => {
    console.log('deleteOnePost');
    // ICIJCO - penser à la cascade quand post, commentaires likes etc

    Post.findById(req.params.id , (error, post) => {
        if (error) {
            console.log(' pb post.findById (deleteOnPost); erreur : ', error);
            if (error.kind == 'not_found') { 
                console.log('post non trouvé'); 
                return res.status(404).json({ message: 'post not found'});
            } else 
                return res.status(500).json({ error });
        }
        // vérfication que le demandeur est bien le propriétaire du post (sauf administrateur)
        if ( (post.userId != req.auth.userId) && !req.auth.roleIsAdmin ) {
            console.log('! tentative piratage ? req.auth.userId =   ', req.auth.userId, '<> post.userId = ', post.userId  );
            return res.status(403).json({ message : 'Not authorized'});
        }

        Post.delete (post , (error, result) => {
            if (error) {
                console.log(' pb post.delete - erreur : ', error);                  
                return res.status(500).json({ error });
            }
            // on supprime le fichier image si il existe
            if ( post.imageUrl != null ) {
                const oldFilename = post.imageUrl.split("/images/post/")[1];
                removeImageFile(oldFilename);      
            }
            res.status(200).json({message : 'post deleted'})
        })

    });
};
