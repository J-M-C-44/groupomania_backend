'use strict';

// <------------------------------------ imports -------------------------------------->
// package jwt : pour décoder le token
const jwt = require('jsonwebtoken');

//Params
const dotenv = require('dotenv').config('../.env');


// <---------------------------- Middleware "authorize" --------------------------->
/**
* vérifie que le token fourni est bien valide  :
*   - si KO : 
    -   renvoi statut 401 si vérication jwt ko
    -   renvoi statut 401 si vérification jwt ok mais user id du body différent de celui du token 
*/
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
       const userId = decodedToken.userId;
       const userRole = decodedToken.userRole;
       let roleIsAdmin = false
       if (decodedToken.userRole == process.env.ROLE_ADMIN) {
            roleIsAdmin = true
       }
        // on vérifie si on a un user id dans le body et si celui ci est le même que celui issu du token (sauf si c'est l'admin)
        if ((req.body.userId && req.body.userId !== userId) &&  !roleIsAdmin) {
            throw "403: unauthorized request";
        } else { 
            req.auth = { 
                userId: userId,
                roleIsAdmin : roleIsAdmin    
            };  
         };

	    next();
   } catch(error) {
       res.status(401).json({ error });
   }
};