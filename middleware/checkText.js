'use strict';
// <------------------------------------- imports --------------------------------------->
// fonction mutualisée de suppression de fichier
const removeImageFile = require('../utils/removeFile');

// les différentes regexp 
// icicjco : revoir la regexp pour éviter injection sql
const charAndDigitTypeRegexpMax = new RegExp('^[a-zàâéèëêïîôùüûçœ@#0-9][a-zàâéèëêïîôùüûçœ€@#0-9\'’,.()!?&_:-\\s]{1,998}[a-zàâéèëêïîôùüûçœ€@#()0-9.!?\\s]$','i');


// <---------------------------- Middleware "checkText" --------------------------->
/**
* vérifie les données transmises pour la création d'un post :
    - text
*   - si KO : suppression du fichier éventuellement transmis et renvoi statut 400 
*/
module.exports = (req, res, next) => {
    let transmittedObject = {};
    if (req.file) {
        if(req.body.post) {
            transmittedObject = JSON.parse(req.body.post); 
        } else {
            transmittedObject = JSON.parse(req.body.comment);
        }
         
    } else {
        transmittedObject = req.body ;
    }

    // check text
    if (charAndDigitTypeRegexpMax.test(transmittedObject.text) == false ) {
        console.log('text invalid : ', transmittedObject.text);
        // si un fichier a été transmis, on le supprime
        if (req.file) { 
            removeImageFile(req.file.filename);
        };
        return res.status(400).json({ message:'Text invalid. Accepted (3 min - 1000 max) : a-z, 0-9 à â é è ë ê ï î ô ù ü ç œ € @ # \' ! ? &  -'});
    } 
    
	next();

};

