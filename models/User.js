// dans models
'use strict';

// <------------------------------------- imports --------------------------------------->
const sql = require('./db');

// <------------------------- gestion des requtes MySQL / table users ------------------->

// constructeur
const User = function(user) {
      this.email      = user.email;
      this.password   = user.password;
      this.lastname   = user.lastname;
      this.firstname  = user.firstname;
      this.fonction   = user.fonction;
      this.avatarUrl  = user.avatarUrl;
      this.role       = user.role
  };

/**
* insert un nouvel enregistrement user dans la table users 
* @param { Object } newUser - nouvel enregistement user
* @return { Object } result - enregistrement user créé avec id correspondant  // ou erreur
*/
User.create = (newUser, result) => {
  sql.query(
      'INSERT INTO users SET ?',
      [newUser],
      
      function (err, res) {
      if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
      }
      console.log("user créé: ", { id: res.insertId, ...newUser });
      result(null, { id: res.insertId, ...newUser });
      }
  );
};
/**
* recherche en table users pour un email donné 
* @param { String } email - email à recherché
* @return { Array } result - 1er enregistrement trouvé ou "not_found"    // ou erreur
*/
User.findByEmail = (email, result) => {
  console.log("email: ", email);
  sql.query(
      'SELECT * FROM users WHERE EMAIL = ?',
      [email],

      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          if (!res.length) {
              // user non trouvé avec email
              result({ kind: "not_found" }, null);
              return;
          } 
          result(null, res[0]);
      }
  );
};

/**
* recherche en table users pour un id donné 
* @param { String } id - id à recherché
* @return { Array } result - 1er enregistrement trouvé ou "not_found"    // ou erreur
*/
User.findById = (id, result) => {
  console.log("id: ", id);
  sql.query(
      'SELECT * FROM users WHERE ID = ?',
      [id] ,

      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          if (!res.length) {
              // user non trouvé avec id
              result({ kind: "not_found" }, null);
              return;
          }
          console.log("user trouvé: ", res[0]);
          result(null, res[0]);
    }
  );

};

/**
* recherche de tous les enregistrements en table users 
* @return { Array } result - tableau des enregistrements trouvés ou "not_found"    // ou erreur
*/
User.findAll = (result) => {

  sql.query(
      'SELECT * FROM users ',

      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          if (!res.length) {
              // users non trouvés
              result({ kind: "not_found" }, null);
              return;
          }
          console.log("users trouvés: ", res);
          result(null, res);
    }
  );

};

/**
* modification de donnés dans la table users pour un user donné 
* @param { String } user.lastname - nouveau nom
* @param { String } user.firstname - nouveau prénom
* @param { String } user.fonction - nouvelle fonction
* @param { String } user.avatarUrl - nouvel Url de l'avatar
* @param { String } user.id - id du user à modifier
* @return { Array } result - tableau des enregistrements trouvés ou "not_found"    // ou erreur
*/
User.updateProfile = (user, result) => {

  sql.query(
      'UPDATE users SET LASTNAME = ?, FIRSTNAME = ?, FONCTION = ? , AVATARURL = ? WHERE ID = ?',
      [user.lastname, user.firstname, user.fonction, user.avatarUrl, user.id],

      function (err, res) {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          console.log("user MAJ: ", res)
          result(null, res)
      }
  );

};

/**
* modification du password dans la table users pour un user donné 
* @param { String } user.password - nouveau password
* @param { String } user.id - id du user à modifier
* @return { Array } result - résultat de la requete    // ou erreur
*/
User.updatePassword = (user, result) => {
  sql.query(
      'UPDATE users SET PASSWORD = ? WHERE ID = ?',
      [user.password, user.id],

      function (err, res) {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          console.log("user MAJ: ", res)
          result(null, res)
      }
  );
};

/**
* modificationde l'email dans la table users pour un user donné 
* @param { String } user.email - nouvel email
* @param { String } user.id - id du user à modifier
* @return { Array } result - résultat de la requete    // ou erreur
*/
User.updateEmail = (user, result) => {
  sql.query(
      'UPDATE users SET  EMAIL = ? WHERE ID = ?',
      [user.email, user.id],

      function (err, res) {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          console.log("user MAJ: ", res)
          result(null, res)
      }
  );
};

/**
* suprresion d'un enregistrement dans la table users pour un user donné 
* @param { String } user.id - id du user à supprimé
* @return { Array } result - résultat de la requete    // ou erreur
*/
User.delete = (user, result) => {
  sql.query(
      'DELETE FROM users WHERE ID = ?',
      [user.id],

      function (err, res) {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          console.log("user deleted ", res)
          result(null, res)
      }
  );
};

module.exports = User;