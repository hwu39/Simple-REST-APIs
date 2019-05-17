//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser:true});

// app.route() can be used to chain multiple methods (REST APIs)
// when using route() app can be ommited for subroutes
// that is, instead of app.get(), we can use .get()

const wikiSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", wikiSchema);

//the model to use to make a get request in mongodb is find:
//<Model Name>.find({conditions}, function(err, results) {
//  Use the found results here
//});
// Reuqests targeting articles
app.route('/articles')
.get(function(req, res) {
  Article.find({}, function(err, results) {
    if (!err) {
      res.send(results);
    }
    else {
      res.send(err);
    }
  });
})

.post(function(req, res) {

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err) {
    if (!err) {
      res.send("Successfully added new article");
    }
    else {
      res.send(err);
    }
  });
})

.delete(function(req, res) {
  Article.deleteMany({}, function(err) {
    if (!err) {
      res.send("Successfully deleted all");
    }
    else {
      res.send(err);
    }
  });
});

//request targeting a specific article
app.route('/articles/:articleTitle')
.get(function(req, res) {

  Article.findOne({title: req.params.articleTitle}, function(err, result) {
    if (result) {
      if (!err) {
        res.send(result);
      }
    }
    else {
      res.send("No such article");
    }
  });
})

.put(function(req, res) {
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err, results) {
      if (!err) {
        res.send("Successfully updated article");
      }
  });
})

.patch(function(req, res) {
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err, results) {
      if (!err) {
        res.send("Successfully updated article");
      }
      else {
        res.send(err);
      }
  });
})

.delete(function(req, res) {
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err, result) {
    if (!err) {
      res.send("Successfully deleted the article");
    }
    else {
      res.send(err);
    }
  });
});
// <ModelName>.deleteMany({conditions}, function(err) {
// });

app.listen(3000, function() {

});
