// dans models
'use strict';

// <------------------------------------- imports --------------------------------------->
const sql = require('./db');

// <------------------------- gestion des requtes MySQL / table posts ------------------->

// constructeur
const Post = function(post) {
      this.userId   = post.userId;
      this.text     = post.text;
      this.imageUrl = post.imageUrl;
  };


/**
* insert un nouvel enregistrement post dans la table posts 
* @param { Object } newPost - nouvel enregistement post
* @return { Object } result - enregistrement post créé avec id correspondant  // ou erreur
*/
Post.create = (newPost, result) => {
  sql.query(
      'INSERT INTO posts SET ?',
      [newPost],
      
      function (err, res) {
      if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
      }
      console.log("post créé: ", { id: res.insertId, ...newPost });
      result(null, { id: res.insertId, ...newPost });
      }
  );
};

/**
* recherche des enregistrements dans la table posts pour un id donné 
* @param { String } id - id à rechercher
* @return { Array } result - 1er résultat de la requete    // ou erreur
*/
Post.findById = (id, result) => {
  console.log("id: ", id);
  sql.query(
      'SELECT * FROM posts WHERE ID = ?',
      [id] ,

      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          if (!res.length) {
              // post non trouvé avec id
              result({ kind: "not_found" }, null);
              return;
          }
          console.log("post trouvé: ", res[0]);
          result(null, res[0]);
    }
  );

};

/**
* recherche des enregistrements dans la table posts pour un user donné 
* @param { String } user.id - id du user à rechercher
* @return { Array } result - résultat de la requete    // ou erreur
*/
Post.findAllByUserId = (userId, result) => {
    sql.query(
        'SELECT * FROM posts WHERE userId = ? ORDER BY createdTime DESC',
        [userId] ,
  
        function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            if (!res.length) {
                // post non trouvé avec id
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("posts trouvés: ", res);
            result(null, res);
      }
    );
  
}

/**
* recherche des enregistrements dans la table posts des différents posts liké par un user donné  (jointure posts / likes)
* @param { String } user.id - id du user à rechercher
* @return { Array } result - résultat de la requete    // ou erreur
*/
Post.findAllLikedByUserId = (userId, result) => {
    sql.query(
        'SELECT * FROM posts JOIN likes ON posts.id = likes.id WHERE likes.userId = ? ORDER BY likes.modifiedTime DESC' ,
        [userId] ,
    
        function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            if (!res.length) {
                // post non trouvé avec id
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("posts trouvés: ", res);
            result(null, res);
        }
    );
    
}
/**
* recherche de tous les enregistrements dans la table posts (sans pagination)
* @return { Array } result - résultat de la requete    // ou erreur
*/
Post.findAll = (result) => {

  sql.query(
      'SELECT * FROM posts  ORDER BY createdTime DESC',

      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }
          if (!res.length) {
              // posts non trouvés
              result({ kind: "not_found" }, null);
              return;
          }
          console.log("posts trouvés: ", res);
          result(null, res);
    }
  );

};

/** 
* recherche de tous les enregistrements dans la table posts (avec pagination)
* @param { String } limit- limit (nb d'enregistrements max à ramaner)
* @param { String } offset - (nb d'enregistrements à bypasser)
* @return { Array } result - résultat de la requete    // ou erreur
*/
Post.findAllPaginated = (limit, offset, result) => {

    sql.query(
        'SELECT * FROM posts  ORDER BY createdTime DESC LIMIT ? OFFSET ?',
        [limit, offset] ,

        function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            if (!res.length) {
                // posts non trouvés
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("posts trouvés: ", res);
            result(null, res);
      }
    );
  
  };

/** 
* recherche dans la table posts de tous les imagesUrl renseignées  pour un user donné
* @param { String } user.id - id du user à rechercher
* @return { Array } result - résultat de la requete    // ou erreur
*/
Post.findAllImagesByUserId = (userId, result) => {
    sql.query(
        'SELECT imageUrl FROM posts WHERE userId = ? and imageUrl <> ?',
        [userId,'NULL'] ,
  
        function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("images posts trouvées: ", res);
            result(null, res);
      }
    );
  
}
/** 
* recherche dans la table posts du nombre total d'enregistrements
* @return { Array } result - total    // ou erreur
*/
Post.count = (result) => {

    sql.query(
        'SELECT COUNT(*) as total FROM posts ',

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
* modification de donnés dans la table posts pour un post donné 
* @param { Object } post - object post contenant les différentes données à mettre à jour et l'id recherché
* @return { Array } result - résultat de la requete ou "not_found"    // ou erreur
*/
Post.update = (post, result) => {
  sql.query(
      'UPDATE posts SET text = ?, imageUrl = ? where id = ?',
      [post.text, post.imageUrl, post.id],

      function (err, res) {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          if (res.affectedRows == 0) {
            // post non trouvé
            result({ kind: "not_found" }, null);
            return;
          }
          console.log("post MAJ: ", res)
          result(null, res)
      }
  );

};

/**
* suppression d'un enregistrement dans la table posts pour un post donné 
* @param { String } post.id - id du post à supprimer
* @return { Array } result - résultat de la requete     // ou erreur
*/ 
Post.delete = (post, result) => {
  sql.query(
      'DELETE FROM posts WHERE ID = ?',
      [post.id],

      function (err, res) {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          console.log("post deleted ", res)
          result(null, res)
      }
  );
};

module.exports = Post;