let mongoose = require("mongoose");
// Schema

let article_Schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  comment: {
    type: Array,
  },
});

let article = (module.exports = mongoose.model("article", article_Schema));
