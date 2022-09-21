'use strict';

const DigitTypeRegexp = new RegExp('^[1-9][0-9]{0,29}$'); 

// <---------------------------- Middleware "checkReq.paramsId" --------------------------->
/**
* vérifie les données transmises dans req.params.id :
*   - si KO : renvoie statut 400 
*/
module.exports = (req, res, next) => {
    
    if (( DigitTypeRegexp.test(req.query.userId) == false) && (req.query.userId!='me')   ) {
        console.log('req.query.userId incorrect : ', req.query.userId);
        return res.status(400).json({ message:'request :userId invalid. Must be an integer or \'me' });
    } 
	next();

};

