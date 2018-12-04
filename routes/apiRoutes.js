// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

// var lakeData = require("../data/lakeData");

// Require all models
var db = require("../models")();

// Connect to the Mondo DB
var databaseUri = 'mongodb://localhost/BassSavvyTestDb';

if (process.env.MONGODB_URI) {
  db.connect(process.env.MONGODB_URI);
} else {
  db.connect(databaseUri);
}



// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  // app.get("/api/lakes", function(req, res) {
  //   res.json(lakeData);
  // });

  // Route to retrieve a single lake's data from db
  app.get("/api/lakes/:lakeName", function (req, res) {
    let lakeName = req.params.lakeName
    db.model("Lake").find({name: lakeName})
      .exec(function (err, data) {
        if (err) {
          res.send(lakeName + " lake data not found");
        } else {
          res.json(data)
        }
      })
  })

  //Route to retrieve lakes in a specific state
  app.get("/api/states/:stateInitial", function(req, res) {
    let stateInitial = req.params.stateInitial;
    db.model("Lake").find({state: stateInitial})
      .exec(function (err, data) {
        if (err) {
          res.send("No data found for " + state);
        } else {
          res.json(data);
        }
      })
  })

};
