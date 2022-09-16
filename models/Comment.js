// dans models
'use strict';

// <------------------------------------- imports --------------------------------------->
const sql = require('./db');

// <----------------------- gestion des requtes MySQL / table comments ------------------>

// constructeur
const Comment = function(comment) {
      this.userId   = comment.userId;
      this.postId   = comment.postId;
      this.text     = comment.text;
      this.imageUrl = comment.imageUrl;
  };


/**
* insert un nouvel enregistrement commentaire dans la table comments 
* @param { Object } newComment - nouvel enregistement comment
* @return { Object } result - enregistrement comment créé avec id correspondant  // ou erreur
*/
Comment.create = (newComment, result) => {
  sql.query(
      'INSERT INTO comments SET ?',
      [newComment],
      
      function (err, res) {
      if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
      }
      console.log("commentaire créé: ", { id: res.insertId, ...newComment });
      result(null, { id: res.insertId, ...newComment });
      }
  );
};

/** 
* recherche des enregistrements de la table comment pour un id donné
* @param { String } id- id à rechercher
* @return { Array } result - 1er résultat de la requete    // ou erreur
*/
Comment.findById = (id, result) => {
  sql.query(
      'SELECT * FROM comments WHERE ID = ?',
      [id] ,

      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          if (!res.length) {
              // commentaire non trouvé avec id
              result({ kind: "not_found" }, null);
              return;
          }
          console.log("commentaire trouvé: ", res[0]);
          result(null, res[0]);
    }
  );

};

/** 
* recherche des enregistrements de la table comment pour un post donné
* @param { String } postId- id du post recherché
* @return { Array } result - résultat de la requete    // ou erreur
*/
Comment.findAllByPostId = (postId, result) => {

  sql.query(
      'SELECT * FROM comments where postId = ?',
      [postId],
      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          if (!res.length) {
              // commentaires non trouvés
              result({ kind: "not_found" }, null);
              return;
          }
          console.log("commentaires trouvés: ", res);
          result(null, res);
    }
  );

};

/** 
* recherche des enregistrements de la table comment pour un user donné
* @param { String } userId- id du user recherché
* @return { Array } result - résultat de la requete    // ou erreur
*/
Comment.findAllByUser = (userId, result) => {

  sql.query(
      'SELECT * FROM comments where userId = ?',
      [userId],
      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          if (!res.length) {
              // commentaires non trouvés
              result({ kind: "not_found" }, null);
              return;
          }
          console.log("commentaires trouvés: ", res);
          result(null, res);
    }
  );

};

/** 
* recherche dans la table comments de tous les imagesUrl renseignées  pour un user donné
* @param { String } userId - id du user à rechercher
* @return { Array } result - résultat de la requete    // ou erreur
*/
Comment.findAllImagesByUserId = (userId, result) => {

  sql.query(
      'SELECT imageUrl FROM comments WHERE userId = ? and imageUrl <> ?',
      [userId,'NULL'] ,

      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          console.log("images commentaires userId trouvés: ", res);
          result(null, res);
    }
  );

};

/** 
* recherche dans la table comments de tous les imagesUrl renseignées  pour les posts d'un user donné (jointure comments / posts)
* @param { String } userId - id du user à rechercher
* @return { Array } result - résultat de la requete    // ou erreur
*/
Comment.findAllImagesOnPostbyUserId = (userId, result) => {

  sql.query(
      'SELECT comments.imageUrl FROM comments JOIN posts ON comments.postID = posts.id  WHERE comments.imageUrl <> ?  and posts.userId = ?',
      ['NULL', userId] ,

      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          console.log("images commentaires sur post d'un userid trouvés: ", res);
          result(null, res);
    }
  );

};

/** 
* recherche dans la table comments de tous les imagesUrl renseignées  pour un post donné
* @param { String } postId - id du post à rechercher
* @return { Array } result - résultat de la requete    // ou erreur
*/
Comment.findAllImagesByPostId = (postId, result) => {

  sql.query(
      'SELECT imageUrl FROM comments where postId = ? and imageUrl <> ?',
      [postId,'NULL'],
      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          console.log("images commentaires trouvés: ", res);
          result(null, res);
    }
  );

};

/**
* modification de donnés dans la table comments pour un commentaire donné 
* @param { Object } comment - object commentaire contenant les différentes données à mettre à jour et l'id recherché
* @return { Array } result - résultat de la requete ou "not_found"    // ou erreur
*/
Comment.update = (comment, result) => {
  sql.query(
      'UPDATE comments SET text = ?, imageUrl = ? where id = ?',
      [comment.text, comment.imageUrl, comment.id],

      function (err, res) {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          if (res.affectedRows == 0) {
            // commentaire non trouvé
            result({ kind: "not_found" }, null);
            return;
          }
          console.log("Comment MAJ: ", res)
          result(null, res)
      }
  );

};

 /**
* suppression d'un enregistrement dans la table comments pour un commentaire donné 
* @param { Object } post.id - object commentaire contenant l'id à rechercher
* @return { Array } result - résultat de la requete     // ou erreur
*/ 
Comment.delete = (comment, result) => {
  sql.query(
      'DELETE FROM comments WHERE ID = ?',
      [comment.id],

      function (err, res) {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          console.log("comment deleted ", res)
          result(null, res)
      }
  );
};

module.exports = Comment;