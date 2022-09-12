'use strict';
// <------------------------------------- imports --------------------------------------->
// fonction mutualisée de suppression de fichier
const removeImageFile = require('../utils/removeFile');

// les différentes regexp 
// icicjco : revoir la regexp pour éviter injection sql
const charAndDigitTypeRegexpMax = new RegExp('^[a-zàâéèëêïîôùüûçœ@#0-9][a-zàâéèëêïîôùüûçœ€@#0-9\'’,.!?&_-\\s]{1,1998}[a-zàâéèëêïîôùüûçœ€@#0-9.!?\\s]$','i');


// <---------------------------- Middleware "checkText" --------------------------->
/**
* vérifie les données transmises pour la création d'un post :
    - text
*   - si KO : suppression du fichier éventuellement transmis et renvoi statut 400 
*/
module.exports = (req, res, next) => {
    let postObject = {};
    if (req.file) {
        if(req.body.post) {
            postObject = JSON.parse(req.body.post); 
        } else {
            postObject = JSON.parse(req.body.comment);
        }
         
    } else {
        postObject = req.body ;
    }

    // check text
    if (charAndDigitTypeRegexpMax.test(postObject.text) == false ) {
        console.log('text invalid : ', postObject.text);
        // si un fichier a été transmis, on le supprime
        if (req.file) { 
            removeImageFile(req.file.filename);
        };
        return res.status(400).json({ message:'Text invalid. Accepted (3 min - 2000 max) : a-z, 0-9 à â é è ë ê ï î ô ù ü ç œ € @ # \' ! ? &  -'});
    } 
    
	next();

};

