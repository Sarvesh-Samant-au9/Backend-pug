const localStratergy = require("passport-local").Strategy;

const User = require("../Models/User");

const config = require("../config/database");

const bcrypt = require("bcryptjs");

module.exports = function (passport) {
  // Local Stratergy
  passport.use(
    new localStratergy(function (username, password, done) {
      // pasword parameter from form
      // Match Username
      let query = { username: username };
      User.findOne(query, function (err, user) {
        if (err) throw err;
        if (!user) {
          return done(null, false, { message: "No User Found " });
        }

        // Match Pasword
        bcrypt.compare(password, user.password, function (err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, "Wrong Password");
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
