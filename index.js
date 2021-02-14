// console.log("Sarvesh")
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const expressValidator = require("express-validator");

const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const config = require("../Solution-Login/config/database");
const passport = require("passport");

mongoose.connect(config.database);

let db = mongoose.connection;

// Check connection
db.once("open", function () {
  console.log("Connected To MongoDb Sarvesh");
});

// Chexk for db errors
db.on("error", function (err) {
  console.log(err);
});

// Bring in Models
let Article = require("./Models/article");
const { param } = require("express-validator");

// Set Public folder
app.use(express.static(path.join(__dirname, "public")));

// Load Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());

//setting up session
app.use(
  session({
    secret: "UBBUFFALO",
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Express validaor
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;
      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

// Passport Config
require("./config/passport")(passport);

// passpoer middlewares
app.use(passport.initialize());
app.use(passport.session());

app.get("*", function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// /Home Route /
app.get("/", (req, res) => {
  // let articles = [
  //   {
  //     id: 1,
  //     title: "Article One",
  //     author: "Sarvesh",
  //     body: "Get Well Soon",
  //     ambition: "Have a Startup by age of 30",
  //   },
  //   {
  //     id: 2,
  //     title: "Article Two",
  //     author: "Kavita",
  //     body: "Prepare Good Food",
  //     ambition: "Millionaire by age of 60",
  //   },
  //   {
  //     id: 3,
  //     title: "Article Three",
  //     author: "Uday",
  //     body: "Wanna Have Big Business",
  //     ambition: "Millionaire by age of 70",
  //   },
  // ];
  Article.find({}, function (err, articles) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "MY ARTICLE",
        articles: articles,
      });
    }
  });
  // res.render("index", {
  //   title: "Sarvesh Be Ready",
  //   articles: articles,
  // });
  // res.send("Hello WORLD");
});

// app.get("/articles/add", function (req, res) {
//   res.render("add");
// });

// app.get("/article/:id", function (req, res) {
//   Article.findById(req.params.id, function (err, article) {
//     res.render("article", {
//       article: article,
//     });
//   });
// });

// // Post Request
// app.post("/articles/add", function (req, res) {
//   req.checkBody("title", "Title Is Required").notEmpty();
//   req.checkBody("author", "Author Is Required").notEmpty();
//   req.checkBody("body", "Article cannot be Empty").notEmpty();

//   // get errors if Any
//   let errors = req.validationErrors();
//   if (errors) {
//     res.render("add", {
//       title: "Add Article",
//       errors: errors,
//     });
//   } else {
//     let article = new Article();
//     article.title = req.body.title;
//     article.author = req.body.author;
//     article.body = req.body.body;

//     article.save(function (err) {
//       if (err) {
//         console.log(err);
//         return;
//       } else {
//         // console.log(req.flash("success", "Article Has Been Added"));
//         req.flash("success", "Article Added");
//         res.redirect("/");
//       }
//     });
//   }

//   // console.log(req.body);
//   // return;
// });

// // Edit Article
// app.get("/article/edit/:id", function (req, res) {
//   Article.findById(req.params.id, function (err, article) {
//     res.render("edit_article", {
//       title: "Edit The Form",
//       article: article,
//     });
//   });
// });

// // update SUbmit
// app.post("/articles/edit/:id", function (req, res) {
//   // Setting to an empty object
//   let article = {};
//   // From form it willl be updated if you update else Not
//   article.title = req.body.title;
//   article.author = req.body.author;
//   article.body = req.body.body;

//   let query = { _id: req.params.id };
//   // updateOne(filter, update)
//   Article.updateOne(query, article, function (err) {
//     if (err) {
//       console.log(err);
//       return;
//     } else {
//       req.flash("success", "Article Updated");
//       res.redirect("/");
//     }
//   });
// });

// // Delete
// app.delete("/article/:id", function (req, res) {
//   let query = { _id: req.params.id };
//   Article.deleteOne(query, function (err) {
//     if (err) {
//       console.log(err);
//     }
//     res.send("Success");
//   });
// });

let articles = require("./Routes/article");
let users = require("./Routes/users");
app.use("/articles", articles);
app.use("/users", users);

// Server is Started
app.listen(8000, function () {
  console.log("SEEVRE WORKING");
});
