'use strict';

// <---------------------------- Middleware "checkLike" --------------------------->
/**
* vérifie que la donnée like transmise pour la MAJ like/dislike est valide:
*   - si KO : renvoi statut 400 
*/
module.exports = (req, res, next) => {
    // console.log('controle like');
    // console.log('req.body.like : ', req.body.like);
    if ( req.body.like == 1 || req.body.like == 0) {
        next();
    } else {
        console.log('donnée like invalide : ', req.body.like);
        return res.status(400).json({ message:'like invalid. Accepted : 1 or 0 ' });   
    }
	
};