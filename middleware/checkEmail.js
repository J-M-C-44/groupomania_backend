'use strict';
// <------------------------------------- imports --------------------------------------->
// package pour contrôle de la validité de l'email 
const emailValidator = require("email-validator");

// <---------------------------- Middleware "checkEmail" --------------------------->
/**
* vérifie que la donnée email transmise pour l'enregistrement est valide (via email-validator)
*   - si KO : renvoi statut 400 
*/
module.exports = (req, res, next) => {
    
    if (emailValidator.validate(req.body.email)) {
        next();
    } else {
        res.status(400).json({ message : 'invalid email'});;
    }
  };
