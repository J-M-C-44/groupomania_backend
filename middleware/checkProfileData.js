'use strict';
// <------------------------------------- imports --------------------------------------->
// fonction mutualisée de suppression de fichier
const removeImageFile = require('../utils/removeFile');

// les différentes regexp
const charAndDigitTypeRegexpMax = new RegExp('^[a-zàâéèëêïîôùüûçœ0-9][a-zàâéèëêïîôùüûçœ0-9\'’,.!?&_-\\s]{1,248}[a-zàâéèëêïîôùüûçœ0-9.!?\\s]$','i');
const charAndDigitTypeRegexpMedium = new RegExp('^[a-zàâéèëêïîôùüûçœ0-9][a-zàâéèëêïîôùüûçœ0-9\'’ !&_-]{1,58}[a-zàâéèëêïîôùüûçœ0-9!\\s]$','i');
const charTypeRegexpMin = new RegExp('^[a-zàâéèëêïîôùüûçœ][a-zàâéèëêïîôùüûçœ0\'’ _-]{1,28}[a-zàâéèëêïîôùüûçœ\\s]$','i');
const DigitTypeRegexp = new RegExp('^[0-9]{1,2}$','i');
const charTypeRegexp =new RegExp('^[a-zàâéèëêïîôùüçœ][a-zàâéèëêïîôùüçœ\'’ -]{0,58}[a-zàâéèëêïîôùüçœ]$','i');
const charTypeRegexpMsg = ' Champs mal renseigné. Caractères acceptés (60 max) : a-z,à â é è ë ê ï î ô ù ü ç œ \'  -';

// <---------------------------- Middleware "checkProfile Data" --------------------------->
/**
* vérifie les données transmises pour la création et la modification de profil user :
    - lastname, firstname, fonction
*   - si KO : suppression du fichier éventuellement transmis et renvoi statut 400 
*/
module.exports = (req, res, next) => {
    // console.log('controle profile data');
    let userObject = {};
    if (req.file) {
        userObject = JSON.parse(req.body.user);  
    } else {
        userObject = req.body ;
    }

    // check lastname
    if (charTypeRegexp.test(userObject.lastname) == false ) {
        console.log('donnée lastname invalide : ', userObject.lastname);
        // si un fichier a été transmis, on le supprime
        if (req.file) { 
            removeImageFile(req.file.filename, 'user');
        };
        return res.status(400).json({ message:'lastname invalid. Accepted (3 min - 60 max) : a-z,à â é è ë ê ï î ô ù ü ç œ \'  -'});
    } 
    // check firstname
    if (charTypeRegexp.test(userObject.firstname) == false ) {
        console.log('donnée firstname invalide : ', userObject.lastname);
        // si un fichier a été transmis, on le supprime
        if (req.file) { 
            removeImageFile(req.file.filename, 'user');
        };
        return res.status(400).json({ message:'firstname invalid. Accepted (3 min - 60 max) : a-z,à â é è ë ê ï î ô ù ü ç œ \'  -'});
    }
    // check fonction
    if (charAndDigitTypeRegexpMedium.test(userObject.fonction) == false ) {
        console.log('donnée fonction invalide : ', userObject.fonction);
        if (req.file) { 
            removeImageFile(req.file.filename, 'user');
        };
        return res.status(400).json({ message:'fonction invalid. Accepted (3 min - 60 max) : a-z,à â é è ë ê ï î ô ù ü û ç œ \'  - _ 0-9' });
    }

    
	next();

};

