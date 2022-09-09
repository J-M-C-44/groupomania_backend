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

    Post.create(post, (error, data) => {
        if (error) {
            if (req.file) { 
                removeImageFile(req.file.filename);
            }
            res.status(500).json({ error })
        }                 
        else {
            // console.log('data : ', data);
            res.status(201).json({ message: 'post created' })
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

        // vérfication que le demandeur est bien le propriétaire du post 
        if (post.userId != req.auth.userId) {
            console.log('! tentative piratage ? post.userId = ', post.userId, ' <> req.auth.userId =   ', req.auth.userId);
            // on fait retour arrière sur l'éventuel fichier transmis
            if (req.file) { 
                removeImageFile(req.file.filename);
            };
            return res.status(403).json({ message : 'Not authorized'});
        }

        // mise à jour de l'enregistrement demandé en BDD posts 
        // sans nouveau fichier image transmis, on conserve l'URL initiale 
        if (!req.file) {
            postObject.imageUrl = post.imageUrl;
        };
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
            // delete fichier précédent si besoin
            if ( (req.file)  && (post.imageUrl != null) ) {
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
            console.log(' pb post.findById (modifyPost); erreur : ', error);
            if (error.kind == 'not_found') { 
                console.log('post non trouvé'); 
                return res.status(404).json({ message: 'post not found'});
            } else 
                return res.status(500).json({ error });
        }

        res.status(200).json(post)
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
        // vérfication que le demandeur est bien le propriétaire du post 
        if (post.userId != req.auth.userId) {
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
