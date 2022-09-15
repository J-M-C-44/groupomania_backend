'use strict';
// <------------------------------------- imports --------------------------------------->
// fonction mutualisée de suppression de fichier
const removeImageFile = require('../utils/removeFile');


const DigitTypeRegexp = new RegExp('^[1-9][0-9]{0,29}$'); 

// <---------------------------- Middleware "checkProfile Data" --------------------------->
/**
* vérifie les données transmises pour la création et la modification de profil user :
    - lastname, firstname, fonction
*   - si KO : suppression du fichier éventuellement transmis et renvoi statut 400 
*/
module.exports = (req, res, next) => {
    
    if (DigitTypeRegexp.test(req.params.id) == false ) {
        console.log('req.params.id incorrect : ', req.params.id);
        return res.status(400).json({ message:'request :id invalid. Must be an integer'});
    } 
	next();

};

