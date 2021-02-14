const express = require("express");
const article = require("../Models/article");
const router = express.Router();
// Bring in Model
let Article = require("../Models/article");

// user mdel
let User = require("../Models/User");

// Add the Article
router.get("/add", userAuthentication, function (req, res) {
  res.render("add", {
    title: "Add Article",
  });
});

// Add Submit Post Request
router.post("/add", function (req, res) {
  req.checkBody("title", "Title Is Required").notEmpty();
  // req.checkBody("author", "Author Is Required").notEmpty();
  req.checkBody("body", "Article Body cannot be Empty").notEmpty();

  // get errors if Any
  let errors = req.validationErrors();
  if (errors) {
    res.render("add", {
      title: "Add Article",
      errors: errors,
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    article.save(function (err) {
      if (err) {
        console.log(err);
        return;
      } else {
        // console.log(req.flash("success", "Article Has Been Added"));
        req.flash("success", "Article Added");
        res.redirect("/");
      }
    });
  }

  // console.log(req.body);
  // return;
});

// Edit Article
router.get("/edit/:id", userAuthentication, function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    if (article.author != req.user._id) {
      // req.flash("danger", "Not Authorized");
      res.redirect("/");
    }
    res.render("edit_article", {
      title: "Edit The Form",
      article: article,
    });
  });
});

// update SUbmit Post Route
router.post("/edit/:id", function (req, res) {
  // Setting to an empty object
  let article = {};
  // From form it willl be updated if you update else Not
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = { _id: req.params.id };
  // updateOne(filter, update)
  Article.updateOne(query, article, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "Article Updated");
      res.redirect("/");
    }
  });
});

// Post A Comment
router.get("/comment/:id", userAuthentication, function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    res.render("comment", {
      commentElement: "Comments are written Here",
      article: article,
    });
  });
});

router.post("/comment/:id", function (req, res) {
  let article = {};
  // article.title = req.body.title;
  // article.author = req.body.author;
  // article.body = req.body.body;
  article.comment = req.body.comment;
  let query = { _id: req.params.id };
  Article.updateOne(query, article, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "Comment Added");
      res.redirect("/");
    }
  });
});

// Delete
router.delete("/:id", function (req, res) {
  if (!req.user._id) {
    res.status(500).send();
  }
  let query = { _id: req.params.id };
  Article.findById(req.params.id, function (err, article) {
    if (article.author != req.user._id) {
      res.status(500).send();
    } else {
      Article.deleteOne(query, function (err) {
        if (err) {
          console.log(err);
        }
        res.send("Success");
      });
    }
  });
});

// Get article Single ones
router.get("/:id", function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    User.findById(article.author, function (err, user) {
      if (err) {
        console.log(err);
      }
      res.render("article", {
        article: article,
        author: user.name,
      });
    });
  });
});

// Access Control
function userAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Kindly login");
    res.redirect("/users/login");
  }
}

module.exports = router;
