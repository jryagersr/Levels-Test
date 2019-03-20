
const mongoose = require("mongoose");
var express = require("express"),
  app = express(),
  request = require("request"),
  _ = require("underscore"),
  db = require("../models")();

// // Connect to the Mondo DB
var databaseUri = 'mongodb://localhost/BassSavvyTestDb';

if (process.env.MONGODB_URI) {
  db.connect(process.env.MONGODB_URI);
} else {
  db.connect(databaseUri);
}

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  require("./dbUpdateRoutes")(app);


  // ===============================================================================
  // GET ROUTES
  // ===============================================================================

  // Route to retrieve a single lake's data from db
  app.get("/api/find-one-lake", function (req, res) {
    let lakeName = req.query.lakeName;
    // match off of href because this value has no caps and no spaces
    // matching off lakename alone requires modifying our entire database
    let hrefMatch = "/lakes/" + lakeName;
    db.model("State").find({
      //   state : stateName 
      "lakes.href": hrefMatch
    })
      .exec(function (err, data) {
        if (err) {
          res.send("There was a problem querying the database");
        } else {
          let currentLake;
          data[0].lakes.forEach(function (e) {
            if (e.href === hrefMatch) {
              currentLake = e;
            }
          })
          res.json(currentLake);
        }
      })
  })

  // Route to retrieve a state's lakes data from db
  app.get("/api/find-one-state", function (req, res) {
    let stateName = req.query.stateName;
    // we can match off statename for this route because the client has done the conversion from id to full name
    db.model("State").find({
      state: stateName
    })
      .exec(function (err, data) {
        if (err) {
          res.send("There was a problem querying the database");
        } else {
          let stateLakes = data[0].lakes;
          res.json(stateLakes);
        }
      })
  })

  // route to retrieve all lake data from the database
  app.get("/api/find-all-lakes", function (req, res) {
    // we can match off statename for this route because the client has done the conversion from id to full name
    db.model("State").find({})
      .exec(function (err, data) {
        if (err) {
          res.send("There was a problem querying the database");
        } else {
          res.json(data);
        }
      })
  })

}; // End of module.exports