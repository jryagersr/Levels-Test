
const mongoose = require("mongoose");
var express = require("express"),
  app = express(),
  request = require("request"),
  _ = require("underscore"),
  db = require("../models")();
var cheerio = require("cheerio");

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
  // require("./dbUpdateRoutes")(app);

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



  // ===============================================================================
  // UPDATE ROUTES
  // ===============================================================================

  // Define cube scrape function
  function scrapeCubeData(callback) {
    // Define our data template
    var data = [{
      lakeName: "High Rock",
      data: []
    }, {
      lakeName: "Badin",
      data: []
    }, {
      lakeName: "Tuckertown",
      data: []
    }];
    // Make request for cub carolinas site, returns html
    request("http://ww2.cubecarolinas.com/lake/tabs.php", function (error, response, html) {

      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(html);

      // With cheerio, find each <td> on the page
      // (i: iterator. element: the current element)
      $('tr').each(function (i, element) {
        // var value = $(this).text();
        var value = $(element).children().text();

        // Skip over the first few sections of data to get to the stuff we need
        if (i > 7) {
          // If the current value is high rock
          if (value.substring(0, 1) === "H") {
            date = value.substring(9, 19);
            elev = value.substring(19, 25);
            data[0].data.push({
              date: date,
              elev: elev
            });
          }
          // If the current value is Badin
          if (value.substring(0, 1) === "B") {
            date = value.substring(15, 25);
            elev = value.substring(25, 31);
            data[1].data.push({
              date: date,
              elev: elev
            });
          }
          // If Tuckertown
          if (value.substring(0, 1) === "T") {
            date = value.substring(10, 20);
            elev = value.substring(20, 26);
            data[2].data.push({
              date: date,
              elev: elev
            });
          }
        }
      });
      callback(null, data);
    });
  };
  // function to update the database with cube data
  function updateCubeDB() {
    scrapeCubeData(function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        // console.log(data);
        data.forEach(function (lake) {
          // console.log(lake.lakeName);
          // console.log(e);
          db.model("State").updateMany(
            { "lakes.bodyOfWater": lake.lakeName },
            {
              $set: {
                "lakes.$.data": lake.data,
              }
            },
            { upsert: true }
          )
            .then(function () {
              console.log("Update Complete");
            })
            .catch(function (err) {
              console.log(err);
            });
        })
      }
    })
  }
  updateCubeDB();
  // setInterval(function(){ console.log("Hello"); }, 43200000);

}; // End of module.exports