'use strict';

const DigitTypeRegexp = new RegExp('^[1-9][0-9]{0,29}$'); 

// <---------------------------- Middleware "checkReq.paramsId" --------------------------->
/**
* vérifie les données transmises dans req.params.id :
*   - si KO : renvoie statut 400 
*/
module.exports = (req, res, next) => {
    
    if ( (DigitTypeRegexp.test(req.params.id) == false) && (req.params.id !='me') ) {
        console.log('req.params.id incorrect : ', req.params.id);
        return res.status(400).json({ message:'request :id invalid. Must be an integer ou "me" '});
    } 
	next();

};

