// dans models
'use strict';
// <------------------------------------- imports --------------------------------------->
const sql = require('./db');

// <------------------------ gestion des requtes MySQL / table likes -------------------->

// constructeur
const Like = function(like) {
      this.userId   = like.userId;
      this.postId   = like.postId;
  };


/**
* insert un nouvel enregistrement like dans la table likes 
* @param { Object } newlike - nouvel enregistement like
* @return { Object } result - enregistrement like créé avec id correspondant  // ou erreur
*/
Like.create = (newlike, result) => {
  sql.query(
      'INSERT INTO likes SET ?',
      [newlike],
      
      function (err, res) {
      if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
      }
      console.log("like créé: ", { id: res.insertId, ...newlike });
      result(null, { id: res.insertId, ...newlike });
      }
  );
};

/** 
* recherche des enregistrements de la table like pour un id donné
* @param { String } id- id à rechercher
* @return { Array } result - 1er résultat de la requete    // ou erreur
*/
Like.findById = (id, result) => {
  console.log("id: ", id);
  sql.query(
      'SELECT * FROM likes WHERE ID = ?',
      [id] ,

      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          if (!res.length) {
              // like non trouvé avec id
              result({ kind: "not_found" }, null);
              return;
          }
          console.log("like trouvé: ", res[0]);
          result(null, res[0]);
    }
  );

};

/** 
* recherche des enregistrements de la table like pour un post donné et un user donné
* @param { String } postId- id du post recherché
* @param { String } userId- id du user recherché
* @return { Array } result - résultat de la requete    // ou erreur
*/
Like.findByPostIdAndUserId = (postId, userId, result) => {
  console.log("postId : ",postId  , 'userId : ', userId)
  sql.query(
      'SELECT * FROM likes WHERE postId = ? AND userId = ?',
      [postId, userId] ,

      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }

          if (res.length) {
              result(null, res[0]);
          } else {
              result(null , 'not_found');
          }
      }
  );
}

/** 
* recherche des enregistrements de la table like pour un post donné
* @param { String } postId- id du post recherché
* @return { Array } result - résultat de la requete    // ou erreur
*/
Like.findAllByPost = (postId, result) => {

  sql.query(
      'SELECT * FROM likes WHERE postId = ?',
      [postId],
      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          if (!res.length) {
              // likes non trouvés
              result({ kind: "not_found" }, null);
              return;
          }
          console.log("likes trouvés: ", res);
          result(null, res);
    }
  );

};

/** 
* recherche des enregistrements de la table like pour un user donné
* @param { String } userId- id du user recherché
* @return { Array } result - résultat de la requete    // ou erreur
*/
Like.findAllByUser = (userId, result) => {

  sql.query(
      'SELECT * FROM likes WHERE userId = ?',
      [userId],
      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          if (!res.length) {
              // likes non trouvés
              result({ kind: "not_found" }, null);
              return;
          }
          console.log("likes trouvés: ", res);
          result(null, res);
    }
  );

};

/** 
* recherche du total des enregistrements de la table like pour un post donné
* @param { String } postId- id du post pour lequel on veut le total
* @return { Array } result - résultat de la requete    // ou erreur
*/
Like.countByPost = (postId, result) => {

  sql.query(
      'SELECT COUNT(*) AS total FROM likes WHERE postId = ?',
      [postId],
      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }

          result(null, res[0].total);
    }
  );

};

/** 
* recherche de tous les enregistrements dans la table likes
* @return { Array } result - résultat de la requete    // ou erreur
*/
Like.findAll = (result) => {
  sql.query(
      'SELECT * FROM likes',

      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          if (!res.length) {
              // likes non trouvés
              result({ kind: "not_found" }, null);
              return;
          }
          result(null, res);
    }
  );

};

/**
* suppression d'un enregistrement dans la table likes pour un like donné 
* @param { String } like.id - id du like à supprimer
* @return { Array } result - résultat de la requete     // ou erreur
*/ 
Like.delete = (like, result) => {
  sql.query(
      'DELETE FROM likes WHERE ID = ?',
      [like.id],

      function (err, res) {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          console.log("like deleted ", res)
          result(null, res)
      }
  );
};

module.exports = Like;