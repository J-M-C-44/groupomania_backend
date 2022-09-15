// dans models
'use strict';

const sql = require('./db');

// constructeur
const Comment = function(comment) {
      this.userId   = comment.userId;
      this.postId   = comment.postId;
      this.text     = comment.text;
      this.imageUrl = comment.imageUrl;
  };


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


Comment.findAllByPost = (postId, result) => {

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