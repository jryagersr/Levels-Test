const mongoose = require("mongoose");
var express = require("express"),
  app = express(),
  request = require("request"),
  _ = require("underscore"),
  fs = require('fs');

// var txData = [];

// Require all models
var db = require("../models")();

// // Connect to the Mondo DB
// var databaseUri = 'mongodb://localhost/BassSavvyTestDb';

// if (process.env.MONGODB_URI) {
//   db.connect(process.env.MONGODB_URI);
// } else {
//   db.connect(databaseUri);
// }

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  var $ = require("jquery");
  var request = require("request");
  // API GET Requests
  // ---------------------------------------------------------------------------

  // Route to retrieve a single lake's data from db
  // app.get("/api/lakes/:lakeName", function (req, res) {
  //   let lakeName = req.params.lakeName
  //   db.model("Lake").find({ name: lakeName })
  //     .exec(function (err, data) {
  //       if (err) {
  //         res.send(lakeName + " lake data not found");
  //       } else {
  //         res.json(data)
  //       }
  //     })
  // })


  //Route to retrieve lakes in a specific state
  app.get("/api/states/:stateInitial", function (req, res) {
    let stateInitial = req.params.stateInitial;
    db.model("Lake").find({
      state: stateInitial
    })
      .exec(function (err, data) {
        if (err) {
          res.send("No data found for " + state);
        } else {
          res.json(data);
        }
      })
  })

  // Route to retrieve ACE data for Kerr Lake
  app.get("/api/kerr", function (request, response) {
    var url = "http://epec.saw.usace.army.mil/dsskerr.txt";
    var indexes = [0, 1, 2, 3, 4]
    getData(10, "Kerr", indexes, url, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data.reverse());
      }
    });

    // Function to pull data
    function getData(col, lakeName, indexes, newUrl, callback) {
      var request = require("request");
      var data = [];

      var options = {
        url: newUrl
      }
      request(options, function (error, response, body) {
        if (error) {
          callback(error);
        }
        _.each(body.split("\r\n"), function (line) {
          // Split the text body into readable lines
          var splitLine;
          line = line.trim();
          splitLine = line.split(/[ ]+/);
          // Check to see if this is a data line
          // Column length and first two characters must match
          if (splitLine.length === col && !isNaN(parseInt(line.substring(0, 2)))) {
            // Loop through each cell and check for missing data
            for (var i = 0; i < splitLine.length; i++) {
              if (splitLine[i].substring(0, 1) === "?" || splitLine[i] == -99) {
                splitLine[i] = "N/A";
              }
            }
            // Formulate the date to remove Month
            let cleanDate = splitLine[indexes[0]].substring(0, 2) + " " + splitLine[indexes[0]].substring(2, 5);
            // Push each line into data object
            data.push({
              lakeName: lakeName,
              date: cleanDate,
              time: splitLine[indexes[1]],
              inflow: splitLine[indexes[2]],
              outflow: splitLine[indexes[3]],
              level: splitLine[indexes[4]]
            });

          }
        });
        callback(null, data);
      });
    }


  });

  // Route to retrieve ACE data for Jordan Lake
  app.get("/api/jordan", function (request, response) {
    var url = "http://epec.saw.usace.army.mil/dssjord.txt";
    var indexes = [0, 1, 8, 9, 10]
    getData(11, "Jordan", indexes, url, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data.reverse());
      }
    });

    // Function to pull data
    function getData(col, lakeName, indexes, newUrl, callback) {
      var request = require("request");
      var data = [];

      var options = {
        url: newUrl
      }
      request(options, function (error, response, body) {
        if (error) {
          callback(error);
        }

        _.each(body.split("\r\n"), function (line) {
          // Split the text body into readable lines
          var splitLine;
          line = line.trim();
          splitLine = line.split(/[ ]+/);
          // Check to see if this is a data line
          // Column length and first two characters must match

          if (splitLine.length === col && !isNaN(parseInt(line.substring(0, 2)))) {
            // Loop through each cell and check for missing data
            for (var i = 0; i < splitLine.length; i++) {
              if (splitLine[i].substring(0, 1) === "?" || splitLine[i] == -99) {
                splitLine[i] = "N/A";
              }
            }
            // Formulate the date to remove Month
            let cleanDate = splitLine[indexes[0]].substring(0, 2) + " " + splitLine[indexes[0]].substring(2, 5);
            // Push each line into data object
            data.push({
              lakeName: lakeName,
              date: cleanDate,
              time: splitLine[indexes[1]],
              inflow: splitLine[indexes[2]],
              outflow: splitLine[indexes[3]],
              level: splitLine[indexes[4]]
            });

          }
        });
        callback(null, data);
      });
    }
  });

  app.get("/api/cube", function (request, response) {
    // Parses our HTML and helps us find elements
    var cheerio = require("cheerio");
    // Makes HTTP request for HTML page
    var request = require("request");

    scrapeCubeData(function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data);
      }
    });

    function scrapeCubeData(callback) {
      // Define our data template
      var data = [
        {
          lakeName: "High Rock",
          data: []
        }, {
          lakeName: "Badin",
          data: []
        }, {
          lakeName: "Tuckertown",
          data: []
        }
      ];

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
              data[0].data.push({ date: date, elev: elev });
            }
            // If the current value is Badin
            if (value.substring(0, 1) === "B") {
              date = value.substring(15, 25);
              elev = value.substring(25, 31);
              data[1].data.push({ date: date, elev: elev });
            }
            // If Tuckertown
            if (value.substring(0, 1) === "T") {
              date = value.substring(10, 20);
              elev = value.substring(20, 26);
              data[2].data.push({ date: date, elev: elev });
            }
          }
        });
        callback(null, data);
      });
    }
  })

  // This reads the tournament file for the Tournaments Page
  app.get("/api/tournaments", function (request, response) {
    // Import our txData from tournamentData.js file
    var txData = require("../data/tournamentData");
    // Declare array to hold our data to send back to the client
    let data = [];
    // Loop through the high level organizations in our data
    for (var i = 0; i < txData.length; i++) {
      var org = txData[i];
      // Loop through the tournaments within each organization
      for (var k = 0; k < org.tournaments.length; k++) {
        var e = org.tournaments[k];
        // Push each line into output data object
        data.push({
          organizer: e.organizer,
          trail: e.trail,
          date: e.date,
          lake: e.lake,
          ramp: e.ramp,
          // state: e.state,
          txDetail: e.txDetail,
          results: e.resultsLink
        });
      }
    }
    response.json(data);
  });


  // Route to retrieve TVA data
  app.get("/api/tva", function (request, response) {
    let tvaURL = request.query.tvaDataURL;
    let tvaLakeName = request.query.tvaLakeName;

    getData(tvaLakeName, tvaURL, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data.reverse());
      }
    });

    // Function to pull data
    function getData(lakeName, newUrl, callback) {
      var request = require("request");
      var data = [];
      var options = {
        url: newUrl,
        type: "xml"
      }
      request(options, function (error, response, body) {
        if (error) {
          callback(error);
        }
        let tvaDate = "";
        let tvaTime = "";
        let tvaElev = "";
        let tvaOutFlow = "";
        let tvaOutFlowStart = 0

        _.each(body.split("\r\n"), function (line) {
          // Split the text body into readable lines
          var splitLine;
          line = line.trim();
          splitLine = line.split(/[ ]+/);

          // Check to see if this is a data line by checking for keywords
          if (line.substring(1, 6) == "LOCAL") {
            // It's a date time line, save the date and time
            // Formulate the date 
            tvaDate = line.substring(15, 25);
            // Formulate the time
            if (line[34] == "<")
              tvaTime = line.substring(25, 34);
            else
              tvaTime = line.substring(25, 35);
          }
          if (line.substring(1, 6) == "UPSTR") {
            // It's an elevation level line, save the elevation
            tvaElev = line.substring(18, 24)
          }
          if (line.substring(1, 4) == "AVG") {
            // Last Data item
            // Set the outFlowStart to 25 (5 char outFlow
            tvaOutFlowStart = 25;
            if (line.substring(24, 25) != " " && line.substring(23, 24) != " ")
              tvaOutFlowStart = 23;
            else if (line.substring(24, 25) != " ")
              tvaOutFlowStart = 24;
            tvaOutFlow = line.substring(tvaOutFlowStart, 30)
            // Push each line into data object
            data.push({
              lakeName: lakeName,
              date: tvaDate,
              time: tvaTime,
              outflow: tvaOutFlow,
              level: tvaElev
            });
          }
        });
        callback(null, data);
      });
    }
  });




  // API POST Requests
  // ---------------------------------------------------------------------------

  // Route to update database with new lake data
  // app.post("/api/usgs", (req, res) => {
  //   console.log("nameID: " + req.body.nameID)
  //   req.body.newBatch.forEach(function (e) {
  //     db.model('Lake').updateOne({
  //       _id: ObjectId(req.body.nameID),
  //       data: [{
  //         level: e.value,
  //         date: e.date,
  //         time: e.time
  //       }]
  //     })
  //       .then(function (data) {
  //         res.json(data);
  //       })
  //       .catch(function (err) {
  //         res.json(err);
  //       });
  //   })
  // });


  //Start of dukeData
  // Route to retrieve DUKE data
  app.get("/api/duke", function (request, response) {
    let dukeURL = request.query.dukeDataURL;
    let dukeLakeName = request.query.dukeLakeName;

    getData(dukeLakeName, dukeURL, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data.reverse());
      }
    });

    // Function to pull data
    function getData(lakeName, newUrl, callback) {
      var request = require("request");
      var data = [];
      var options = {
        url: newUrl,
        type: "xml"
      }
      request(options, function (error, response, body) {
        if (error) {
          callback(error);
        }
        let dukeLakes = JSON.parse(body);

        callback(null, dukeLakes);
      });
    }
  });

  //End of dukeData
}; // End of module.exports