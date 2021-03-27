const express = require("express");
const favoriteRouter = express.Router();
const authenticate = require("../authenticate");
const Favorite = require("../models/favorite");
const cors = require("./cors");

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          req.body.forEach((fav) => {
            if (!favorite.campsites.includes(fav._id)) {
              favorite.campsites.push(fav._id);
            }
          });
          favorite
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          Favorite.create({ user: req.user._id })
            .then((favorite) => {
              req.body.forEach((fav) => {
                if (!favorite.campsites.includes(fav._id)) {
                  favorite.campsites.push(fav._id);
                }
              });
              favorite
                .save()
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(favorite);
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((favorite) => {
        res.statusCode = 200;
        if (favorite) {
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        } else {
          res.setHeader("Content-Type", "text/plain");
          res.end("You do not have any favorites to delete.");
        }
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `GET operation not supported on /favorites/${req.params.campsiteId}`
    );
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          //if there are favorites...
          if (!favorite.campsites.includes(req.params.campsiteId)) {
            //if campsiteId is not already in favorites
            favorite.campsites.push(req.params.campsiteId); //push to favorite campsites array
            favorite
              .save() //then save document and send favorite object in response back to user
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch((err) => next(err));
          } else {
            //if favorites (i.e. campsiteId) already exists in favorites array, say already sent
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("That campsite is already a favorite!");
          }
        } else {
          //if no favorites exist, create a new favorites document
          Favorite.create({
            //with these fields (with campsites field as an array)
            user: req.user._id,
            campsites: [req.params.campsiteId],
          })
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err)); //error sent to Express to deal with
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /favorites/${req.params.campsiteId}`
    );
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          const index = favorite.campsites.indexOf(req.params.campsiteId); //get the index of the campsite with this Id
          if (index >= 0) {
            //if index exists and is greater than 0
            favorite.campsites.splice(index, 1); //remove the object with that campsiteId (1 means remove only one)
          }
          /* can alternatively use filter as below, instead of using indexOf/splice, 
               but make sure to use loose inequality OR do fav.toString() before comparing: */
          //favorite.campsites = favorite.campsites.filter(fav => fav.toString() !== req.params.campsiteId);
          favorite
            .save() //then save favorite document
            .then((favorite) => {
              console.log("Favorite Campsite Deleted!", favorite);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("You do not have any favorites to delete.");
        }
      })
      .catch((err) => next(err));
  });
module.exports = favoriteRouter;
