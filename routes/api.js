/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

module.exports = function (app) {
  const express = require("express");
  const cors = require("cors");
  require("dotenv").config();
  const mongoose = require("mongoose");
  app.use(cors());
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: [String],
    commentcount: Number,
  });
  let Book = mongoose.model("Book", bookSchema);

  app
    .route("/api/books")
    .get(function (req, res) {
      const books = Book.find({}, (err, data) => {
        if (err) {
          res.send("There was an error");
          return;
        }
        res.send(data);
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function (req, res) {
      let title = req.body.title;
      if (!title) {
        res.send("missing required field title");
        return;
      }
      const book = new Book({
        title: title,
        commentcount: 0,
      }).save((err, data) => {
        if (err || !data) {
          res.send("There was an error");
        } else {
          res.json({ _id: data._id, title: data.title });
        }
      });
      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      Book.findOne({ _id: bookid }, (err, data) => {
        if (err || !data) {
          res.send("no book exists");
        } else {
          res.json(data);
        }
      });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        res.send("missing required field comment");
        return;
      }
      Book.findOne({ _id: bookid }, (err, data) => {
        if (err || !data) {
          res.send("no book exists");
        } else {
          data.comments.push(comment);
          data.commentcount += 1;
          data.save((err, data) => {
            if (err || !data) {
              res.send("There was an error");
            } else {
              res.json(data);
            }
          });
        }
      });
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
