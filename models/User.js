// dans models
'use strict';

const sql = require('./db');


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
          // console.log("user trouvé: ", res[0]);
          result(null, res[0]);
      }
  );
};

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
          console.log("users trouvés: ", res)
          console.log("user trouvé: ", res[0]);
          result(null, res[0]);
    }
  );

};


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

User.updateProfile = (user, result) => {
  //console.log('icijco - entrée updateProfile, données : ', user.lastname, user.firstname, user.fonction, user.avatarUrl, user.id);
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