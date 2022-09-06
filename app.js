//Require Express, bodyParser, Ejs, Mongoose(connection)
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

//Using template engines with Express
app.set("view engine", "ejs");

//Node.js body parsing middleware with Express
app.use(bodyParser.urlencoded({ extended: true }));

//Serving static files in Express
app.use(express.static("public"));

//Moongose Connection & Schema & Model
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/wikiDB");
}

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

//Chained Route| HTTP verbs ***** Requesting All Articles*****//
app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added a new article!");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Sucessfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

//Chained Route| HTTP verbs ***** Requesting a Specific Articles*****//
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, docs) => {
      if (docs) {
        res.send(docs);
      } else {
        res.send(err + " No such article was fund!");
      }
    });
  })
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (response) => {
        if (response) {
          res.send("This article is sucessfully updated!");
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      (response) => {
        if (response) {
          res.send(response + "Edited sucessfully");
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (response) => {
      if (response) {
        res.send(response + "The article is deleted!");
      }
    });
  });

mongoose.set("debug", true);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
