'use strict';

const DigitTypeRegexp = new RegExp('[^0-9]'); 

// <---------------------------- Middleware "checkQuery " --------------------------->
/**
* vérifie les données transmises dans l'url pour les paramètres page et limit :
*   - si KO : renvoie statut 400 
*/
module.exports = (req, res, next) => {
    
   // page
    if (req.query.page && DigitTypeRegexp.test(req.query.page) == true ) {
        console.log('req.query.page incorrect : ', req.query.page);
        return res.status(400).json({ message:'request query.page invalid. Must be an integer'});
    } 

    // limit
    if (req.query.limit && DigitTypeRegexp.test(req.query.limit) == true ) {
        console.log('req.query.limit incorrect : ', req.query.limit);
        return res.status(400).json({ message:'request query.limit invalid. Must be an integer'});
    } 
	next();

};

