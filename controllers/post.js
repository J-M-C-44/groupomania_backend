// dans controllers
'use strict';
// <------------------------------------- imports --------------------------------------->

// param
const dotenv = require('dotenv').config('../.env');
    // console.log('dotenv : ', dotenv);
  
// mySQL - table posts
const Post = require('../models/Post')
const Comment = require('../models/Comment') 
   
// packages :
// fonction mutualisée de suppression de fichier
const removeImageFile = require('../utils/removeFile');




// <-------------------------------- Controller "createPost" ------------------------------->
/**
* enregistrement d'un nouveau post dans la BDD posts
*   - remarque : contrôle des entrées effectuées au préalable dans middlewares
*   - si ok : renvoie statut 201
*   - si ko : renvoie statut 500
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

// <-------------------------------- Controller "modifyPost" ------------------------------->
/**
* modifications des informations d'un post donné.
*   - remarque : contrôle des entrées efffectué au préalable dans le middleware checkProfileData
*   - seul son propriétaire et l'administrateur sont autorisés à modifier le post  
*   - si ok : renvoie statut 200 (et on supprime l'ancien fichier le cas échéant)
*   - si ko : renvoie statut 403, 404 ou 500 (et on supprime le fichier transmis le cas échéant)
*/
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

            let body = {};
            if (req.file) {
                body =  {message : 'post modified', imageUrl : postObject.imageUrl }
            } else {
                body =  {message : 'post modified' }
            }
            res.status(200).json(body)
        })
    }); 
} 

// <-------------------------------- Controller "getOnePost" ------------------------------->
/**
* récupération des informations d'un post à partir son id
*   - si ok : renvoie statut 200 et données
*   - si ko : renvoie statut 404 ou 500
*/      
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

// <-------------------------------- Controller "getAllPostsForOneUser" ------------------------------->
/**
* récupération des informations d'un post créé par un user ID donné
*   - si ok : renvoie statut 200 et données
*   - si ko : renvoie statut 404 ou 500
*/ 
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

// <-------------------------------- Controller "getAllLikedPostsForOneUser" ------------------------------->
/**
* récupération des informations des posts likés par un user donné
*   - si ok : renvoie statut 200 et données
*   - si ko : renvoie statut 404 ou 500
*/ 
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
// <-------------------------------- Controller "getAllPostsLikedbyOneUser" ------------------------------->
/**
* récupération des informations des posts likés par un user donné
*   - si ok : renvoie statut 200 et données
*   - si ko : renvoie statut 404 ou 500
*/ 
exports.getAllPostsLikedbyOneUser = (req, res, next) => {
    console.log('getAllPostsLikedbyOneUser');
    // recherche des enregistrements en BDD post et like pour le user demandé
    const userId = (req.query.userId == 'me') ? req.auth.userId : Number(req.query.userId);
    Post.findAllLikedByUserId(userId , (error, posts) => {

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


// <-------------------------------- Controller "getAllPosts" ------------------------------->
/**
* récupération des informations de l'ensemble des posts (sans pagination)
*   - si ok : renvoie statut 200 et données
*   - si ko : renvoie statut 404 ou 500
*/ 
exports.getAllPosts = (req, res, next) => {
    console.log('getAllPosts');
    // recherche de l'enregistrement demandé en BDD post  
    Post.findAll( (error, posts) => {

        if (error) {
            console.log(' pb post.findAll; erreur : ', error);
            
            if (error.kind == 'not_found') { 
                console.log('post non trouvé'); 
                return res.status(404).json({ message: 'post not found'});

            } else 
                return res.status(500).json({ error });
        }

        res.status(200).json(posts)
    }); 
} 

// <------------------------------ Controller "getAllPostsPaginated" --------------------------->
/**
* récupération des informations de l'ensemble des posts (avec pagination)
*   valeurs par défaut : page = 1, limit (nb par page) = 10
*   - si ok : renvoie statut 200 et données post (+ données de pagination)
*   - si ko : renvoie statut 404 ou 500
*/ 
exports.getAllPostsPaginated = (req, res, next) => {
    console.log('getAllPostsPaginated');

    const page = Number(req.query.page) || 1 ;
    const limit = Number(req.query.limit) || 10 ;
    const offset = ( (page -1) * limit)  
    // recherche de l'enregistrement demandé en BDD post  
    Post.findAllPaginated(limit, offset, (error, posts) => {

        if (error) {
            console.log(' pb post.findAllPaginated; erreur : ', error);
            // si pb, on fait retour arrière sur l'éventuel fichier transmis
            
            if (error.kind == 'not_found') { 
                console.log('post non trouvé'); 
                return res.status(404).json({ message: 'post not found'});

            } else 
                return res.status(500).json({ error });
        }

        Post.count ((error, countPosts) => {
            if (error) {
                console.log(' pb Post.count (getAllPostsPaginated); erreur : ', error);
                return res.status(500).json({ error });
            }

            const currentPage = page;
            const totalPages = Math.ceil(countPosts / limit);
            const firstPage = (currentPage == 1) ? true: false;
            const lastPage = (currentPage == totalPages) ? true: false;
            const totalRows = countPosts;
            
            res.status(200).json({
                posts,
                currentPage : currentPage,
                totalPages: totalPages,
                firstPage : firstPage,
                lastPage : lastPage,
                totalRows : totalRows,

            }) 
        }) 
    }); 
} 

// <-------------------------------- Controller "deleteOnePost" ------------------------------->
/**
* suppression d'un post donné.
*   - seul son propriétaire et l'administrateur sont autorisés à supprimer un post
*   - la suppression des données associées likes et comments est effectuée en cascade sql, 
*   - les fichiers images des comments associées sont aussi supprimés
*   - si ok : renvoie statut 200
*   - si ko : renvoie statut 403, 404 ou 500
*/
exports.deleteOnePost = (req, res, next) => {
    console.log('deleteOnePost');

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

        // la suppression du post va déclencher la supression des commentaires correspondants (via la cascade SQL). 
        // Par contre les fichiers images des commentaires ne seront pas supprimés automatiquement, 
        //  --> il faut récupérer leurs noms en BDD pour pouvoir les supprimer après.
        Comment.findAllImagesByPostId(post.id, (error, ImagesFilesCommentonPost) => {
            if (error) {
                console.log(' pb comment.findAllImagesByPostId (deleteOnPost); erreur : ', error);
                ImagesFilesCommentonPost = [] ;
            }

            Post.delete (post , (error, result) => {
                if (error) {
                    console.log(' pb post.delete - erreur : ', error);                  
                    return res.status(500).json({ error });
                }
                // on supprime le fichier image du post si il existe
                if ( post.imageUrl != null ) {
                    const oldFilename = post.imageUrl.split("/images/post/")[1];
                    removeImageFile(oldFilename);      
                }
    
                // on supprime les fichiers des commentaires "en cascade"
                for (let item of ImagesFilesCommentonPost) {
                    let oldFilename = item.imageUrl.split("/images/post/")[1];
                    removeImageFile(oldFilename)
                }
                res.status(200).json({message : 'post deleted'})
            })  
        })

    });
};
