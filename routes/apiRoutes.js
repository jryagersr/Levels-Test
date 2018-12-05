
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

module.exports = function (app) {
  // API GET Requests
  // ---------------------------------------------------------------------------

  // Route to retrieve a single lake's data from db
  app.get("/api/lakes/:lakeName", function (req, res) {
    let lakeName = req.params.lakeName
    db.model("Lake").find({ name: lakeName })
      .exec(function (err, data) {
        if (err) {
          res.send(lakeName + " lake data not found");
        } else {
          res.json(data)
        }
      })
  })

  //Route to retrieve lakes in a specific state
  app.get("/api/states/:stateInitial", function (req, res) {
    let stateInitial = req.params.stateInitial;
    db.model("Lake").find({ state: stateInitial })
      .exec(function (err, data) {
        if (err) {
          res.send("No data found for " + state);
        } else {
          res.json(data);
        }
      })
  })

  // API POST Requests
  // ---------------------------------------------------------------------------

  // Route to update database with new lake data
  app.put("/api/usgs", (req, res) => {
    db.model('Lake').updateMany(
      { _id: req.params.id },
      { }
    )
      .then(function (places) {
        res.json(places);
        console.log("Count increased");
      })
      .catch(function (err) {
        res.json(err);
      });
  });

};
