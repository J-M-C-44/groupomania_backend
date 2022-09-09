'use strict';
// <------------------------------------- imports --------------------------------------->
// package pour contrôle de la validité de l'email 
const emailValidator = require("email-validator");

// <---------------------------- Middleware "checkEmail" --------------------------->
/**
* vérifie que la donnée email transmise pour l'enregistrement est valide (via email-validator)
*   - si KO : renvoi statut 400 
*/
//ICIJCO : voir si toujours OK
module.exports = (req, res, next) => {
    console.log(' --> req.body.email ',  req.body.email)
    console.log(' --> req.body',  req.body)
    
    if (emailValidator.validate(req.body.email)) {
        next();
    } else {
        res.status(400).json({ message : 'invalid email'});;
    }
  };
