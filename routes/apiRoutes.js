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
    let lakeName = request.query.lakeName;
    // Import our txData from tournamentData.js file
    var lakeTxData = require("../data/tournamentData");
    var flatLakeTx = [];

    // If this call is from the Upcoming Tournaments or Tournament Results pages
    // Then do not flatten the data (right now do not want to modify the filtering code on those pages)
    // If this call is from the Tx or TxR tabs on a lake page, flatten the data
    // and return only the tournaments for that lake. 
    // Performance improvement off-loading the flattening and selecting only this lake from the client

    if (typeof lakeName !== 'undefined') {

      flattenData(lakeTxData, function () {
        // sort by date when page loads (needs to be changed to be variable);

        // sort by date when page loads (needs to be changed to be variable);
        //var newBatch = flatBatch.sort(sort_by('date', sortType, function (a) {
        //    return a.toUpperCase()
        //}));

        // sort by date when page loads (needs to be changed to be variable);
        var flatTxData = flatBatch.sort(function (a, b) {
          var nameA = a.date.toUpperCase(); // ignore upper and lowercase
          var nameB = b.date.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });

        // Take flattened data and retrieve only this lake's Txs
        flatTxData.forEach(function (tourney, i) {
          // Is it for this lake?
          if ((tourney.lakeID == lakeName)) { // if lake matches for lake Tx 
            flatLakeTx.push(tourney); // Push onto data to be returned
          }
        });

      });

      response.json(flatLakeTx); // return this lake's tournaments
    } else
    response.json(lakeTxData); // return all lakes tournaments
  });

  // This reads the ramp file for the thisLake Page
  app.get("/api/ramps", function (request, response) {
    let lakeName = request.query.lakeName;

    // Import our rampData from rampData.js file
    var rampData = require("../data/rampData");
    var thisLakeRampData = [];

    // If a lakename specified, only return ramps for that lake, else return all ramps
    if (lakeName) {
      rampData.forEach(function (ramp, i) {

        if (ramp.id == lakeName) {
          thisLakeRampData.push(ramp);
        };
      });
      response.json(thisLakeRampData); // return this lake's ramps
    } else response.json(rampData); // return all ramps

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


  /******************************************************************************************************************/
  // function to flatten the nested tournament data (dataRoute Tournaments)
  function flattenData(data, callback) {
    flatBatch = [];
    data.forEach(function (element) {
      for (k = 0; k < element.trails.length; k++) {

        for (l = 0; l < element.trails[k].tournaments.length; l++) {

          // Format the tx date to check against today's date
          let txDate = new Date(element.trails[k].tournaments[l].date);
          let todaysDate = new Date();
          let txType = 0;

          // check which page we're on


          // If tx date is in the future (exclude all past dates)
          if (Date.parse(txDate) + 60000000 >= Date.parse(todaysDate))

            txType = 0; // set type of Tx (future) for thisLake.js

          else

            // If tx date is in the past (exclude all future dates)
            if (Date.parse(txDate) < Date.parse(todaysDate))

              txType = 1; // set type of Tx (result) for thisLake.js

          // Push our data into a flat array for easier sort later
          flatBatch.push({
            type: txType,
            organizer: element.organization,
            trail: element.trails[k].trail,
            date: element.trails[k].tournaments[l].date,
            lake: element.trails[k].tournaments[l].lake,
            lakeID: element.trails[k].tournaments[l].lakeID,
            ramp: element.trails[k].tournaments[l].ramp,
            state: element.trails[k].tournaments[l].state,
            entryLink: element.trails[k].tournaments[l].entryLink,
            resultsLink: element.trails[k].tournaments[l].resultsLink
          });
        };
      };
    });
    callback(flatBatch);
  };


}; // End of module.exports