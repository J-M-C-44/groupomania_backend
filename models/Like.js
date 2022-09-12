// dans models
'use strict';

const sql = require('./db');

// constructeur
const Like = function(like) {
      this.userId   = like.userId;
      this.postId   = like.postId;
  };

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

Like.countByPost = (postId, result) => {

  sql.query(
      'SELECT COUNT(*) FROM likes WHERE postId = ?',
      [postId],
      function (err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
          }

          console.log("nb likes trouvés: ", res[0]['COUNT(*)']);
          console.log("res.length ", res.length);
          result(null, res[0]['COUNT(*)']);
    }
  );

};

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