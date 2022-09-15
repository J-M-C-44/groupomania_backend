// dans models
'use strict';

const sql = require('./db');

// constructeur
const Post = function(post) {
      this.userId   = post.userId;
      this.text     = post.text;
      this.imageUrl = post.imageUrl;
  };


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

Post.findAll = (result) => {

  sql.query(
      'SELECT * FROM posts  ORDER BY modifiedTime DESC',

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