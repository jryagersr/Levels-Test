// Holds our display data to send into buildTable function
let displayBatch = [];

// Variable to calculate and display current pool level
let lakePool = 0;
let seaLevelDelta = 0;
let elevationAdjust = 0;

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  require("./dbRoutes")(app);
  var _ = require("underscore");


  // ===============================================================================
  // GET ROUTES
  // ===============================================================================

  // Route to retrieve lakes in a specific state
  app.get("/api/states/:state", function (req, res) {
    var data = require("../data/lakeData");
    let state = req.query.state;
    var stateObj = data.find(e => e.state === state);
    res.send(stateObj);
  })

  // Route to retrieve lakeData.js
  app.get("/api/lake-data", function (req, res) {
    // Import lake data from lakeData.js
    var data = require("../data/lakeData");
    res.json(data);
  })



  // ===============================================================================
  // GET DATA ROUTES
  // ===============================================================================

  // This reads the tournament file for the Tournaments Page
  app.get("/api/tournaments", function (request, response) {
    // Import our txData from tournamentData.js file
    var txData = require("../data/tournamentData");
    response.json(txData);
  });

  // This reads the ramp file for the thisLake Page
  app.get("/api/ramps", function (request, response) {
    // Import our rampData from rampData.js file
    var rampData = require("../data/rampData");
    response.json(rampData);
  });

  // retrieve zipData file
  app.get("/api/zip", function (request, response) {
    // obtain user's zip from client
    let userZip = request.query.userZip;
    // load in zip lat lon data
    var zipData = require("../data/zipData");
    data = {};
    // loop through zip data and check for a match
    zipData.forEach(function (zip) {
      // if match send the lat lon to client
      if (userZip == zip.zip) {
        data.zip = zip.zip;
        data.lat = zip.lat;
        data.lon = zip.lon;
      }
    });
    response.send(data);
  })

  // This returns the sponsor file
  app.get("/api/sponsors", function (request, response) {
    // Import our txData from newSponsorData.js file
    var sponsorData = require("../data/sponsorData");
    response.json(sponsorData);
  });

}; // End of module.exports