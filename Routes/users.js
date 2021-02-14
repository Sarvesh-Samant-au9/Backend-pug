const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
let User = require("../Models/User");

// // // Register Form
router.get("/register", function (req, res) {
  res.render("register");
});

module.exports = router;
// // // register post process
router.post("/register", function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const cPassword = req.body.cPassword;
  req.checkBody("name", "Name is necessary to Enter").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Enter a Valid Email").isEmail();
  req.checkBody("username", "Enter a User Name").notEmpty();
  req.checkBody("password", "Password cannot be Empty").notEmpty();
  req
    .checkBody("cPassword", "Passwords dont match, Kindly check Again")
    .equals(req.body.password);
  let errors = req.validationErrors();
  if (errors) {
    res.render("register", {
      errors: errors,
    });
  } else {
    let newUser = new User({
      name: name,
      password: password,
      email: email,
      username: username,
    });
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function (err) {
          if (err) {
            return console.log(err);
          } else {
            req.flash(
              "success",
              "Registered Yaaa, You can now login into our servers"
            );
            res.redirect("/users/login");
          }
        });
      });
    });
  }
});

// login From
router.get("/login", function (req, res) {
  res.render("login");
});

// Login Process
router.post("/login", function (req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", function (req, res) {
  req.logOut();
  req.flash("success", "You are Logged out")
  res.redirect('/users/login')
});

// //   // Old Code Here
// //   else {
// //     const salted = await bcrypt.getSalt(10);
// //     const newUser = await User.create({
// //       name: req.body.name,
// //       email: req.body.email,
// //       username: req.body.username,
// //       password: await bcrypt.hash(req.body.password, salted),
// //     });
// //     newUser.save();
// //     req.flash("success", "You are, Registered in and Logged In ");
// //     res.redirect("/users/login");
// //   }
// // });
// // router.get("/login", function (req, res) {
// //   res.render("login");
// // });

// // module.exports = router;

// // // else {

// // //   let newUser = new User({
// // //     name: name,
// // //     email: email,
// // //     password: password,
// // //     username: username,
// // //   });
// // //   bcrypt.genSalt(10, function (err, salt) {
// // //     bcrypt.hash(newUser.password, salt, function (err, hash) {
// // //       if (err) {
// // //         console.log(err);
// // //       }
// // //       newUser.password = hash;
// // //       newUser.save(function (err) {
// // //         if (err) {
// // //           console.log(err);
// // //           return;
// // //         } else {
// // //           req.flash("success", "You are Registered and can Login");
// // //           res.redirect("/users/login");
// // //         }
// // //       });
// // //     });
// // //   });
// // // }

// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt");
// // const passport = require("passport");
// const User = require("../Models/User");

// // Register Form
// router.get("/register", async (req, res) => {
//   res.render("register");
// });

// // Register Proccess
// router.post("/register", async (req, res) => {
//   const name = req.body.name;
//   const email = req.body.email;
//   const username = req.body.username;
//   const password = req.body.password;
//   const password2 = req.body.password2;

//   req.checkBody("name", "Name is required").notEmpty();
//   req.checkBody("email", "Email is required").notEmpty();
//   req.checkBody("email", "Email is not valid").isEmail();
//   req.checkBody("username", "Username is required").notEmpty();
//   req.checkBody("password", "Password is required").notEmpty();
//   req
//     .checkBody("password2", "Passwords do not match")
//     .equals(req.body.password);

//   let errors = req.validationErrors();

//   if (errors) {
//     res.render("register", {
//       errors: errors,
//     });
//   }
// else {
// //     const salt = await bcrypt.genSalt(10);
// //     const newUser = await User.create({
// //       name: req.body.name,
// //       email: req.body.email,
// //       username: req.body.username,
// //       password: await bcrypt.hash(req.body.password, salt),
// //     });
// //     newUser.save();
// //     req.flash("success", "You are now registered and can log in");
// //     res.redirect("/users/login");
// //   }
// // });

// // Login Form
// router.get("/login", async (req, res) => {
//   res.render("login");
// });
