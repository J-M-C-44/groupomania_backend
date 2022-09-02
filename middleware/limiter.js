'use strict';
// <------------------------------------ imports -------------------------------------->
// package pour imposer des limitations d'appels à l'API. Basé sur le nombre par IP.
const rateLimit = require('express-rate-limit');


// <------------------------------ Middleware "loginRate" ---------------------------->
/**
* vérifie si le maximum de connexions paramétré pour le login n'est pas dépassé (via express-rate-limit)
*   - si dépassé : renvoi statut 429 
*/
exports.loginRate = rateLimit({
        windowMs: 5 * 60 * 1000, // 5 minutes
        max: 5, // Limit each IP to 3 requests per `window` (here, per 5 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// <---------------------------- Middleware "signupRate" ---------------------------->
/**
* vérifie si le maximum de connexions paramétré pour l'enregistrement n'est pas dépassé (via express-rate-limit)
*   - si dépassé : renvoi statut 429 
*/
exports.signupRate = rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10, // Limit each IP to 100 requests per `window` (here, per 1 hour)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
