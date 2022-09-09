// dans models
'use strict';

const sql = require('./db');

// constructeur
const Post = function(post) {
      this.userId   = post.userId;
      this.text     = post.text;
      this.imageUrl = post.imageUrl;
  };


Post.create = (newpost, result) => {
  sql.query(
      'INSERT INTO posts SET ?',
      [newpost],
      
      function (err, res) {
      if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
      }
      console.log("post créé: ", { id: res.insertId, ...newpost });
      result(null, { id: res.insertId, ...newpost });
      }
  );
};

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


Post.findAll = (result) => {

  sql.query(
      'SELECT * FROM posts',

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