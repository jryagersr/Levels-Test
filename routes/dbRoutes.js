
var express = require("express"),
  request = require("request"),
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
}; // End of module.exports







// ===============================================================================
// UPDATE FUNCTION
// ===============================================================================



// CUBE FUNCTION
// ===============================================================================
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
            elev: elev,
            time: "6:00",
            flow: "N/A"
          });
        }
        // If the current value is Badin
        if (value.substring(0, 1) === "B") {
          date = value.substring(15, 25);
          elev = value.substring(25, 31);
          data[1].data.push({
            date: date,
            elev: elev,
            time: "6:00",
            flow: "N/A"
          });
        }
        // If Tuckertown
        if (value.substring(0, 1) === "T") {
          date = value.substring(10, 20);
          elev = value.substring(20, 26);
          data[2].data.push({
            date: date,
            elev: elev,
            time: "6:00",
            flow: "N/A"
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
      data.forEach(function (lake) {
        db.model("State").updateMany(
          { "lakes.bodyOfWater": lake.lakeName },
          {
            $addToSet: {
              "lakes.$.data": { $each: lake.data }
            }
          },
          { upsert: true }
        )
          .then(function () {
            console.log(lake.lakeName + " Update Complete (Cube)");
          })
          .catch(function (err) {
            console.log(err);
          });
      })
    }
  })
}
// run the function once and then again every 12 hours 
updateCubeDB();
setInterval(updateCubeDB, 43200000);



// USGS FUNCTION
// ===============================================================================
// function to get USGS data
function getUSGSData(usgsURL, bodyOfWater, seaLevelDelta, callback) {
  let displayBatch = [];
  let lakePool = 0;
  let elevationAdjust = 0;
  var request = require("request");
  var data = [];

  request(usgsURL, function (error, response, body) {
    if (error) {
      callback(error);
    }

    // clear displayBatch
    displayBatch = [];

    data = JSON.parse(body);

    // Check to see if the sensor is returning data
    if (data.value.timeSeries.length > 0) {
      let valuesIndex = 0;
      // Parse the json data return to find the values we want
      let jIncrement = 1;
      if (bodyOfWater == "Mille Lacs")
        valuesIndex = 1 // For some reason Mille Lacs has changed from index 0 to index 1 02/10/19

      // To retrieve Flows from USGS, we get multiple .timevalues and the variable.variableDecription 
      // value will contain "Discharge" 'Gage' for Flow or Elev data. We must determine which timevalues
      let timeSeriesLength = data.value.timeSeries.length;
      let timeSeriesElevIndex = 0; // default value indicates no data
      let timeSeriesFlowIndex = -1;

      for (i = 0; i < timeSeriesLength; i++) {
        if (data.value.timeSeries[i].variable.variableDescription.includes("Discharge"))
          timeSeriesFlowIndex = i;
        else if (data.value.timeSeries[i].variable.variableDescription.includes("Gage height") ||
          data.value.timeSeries[i].variable.variableDescription.includes("water surface"))
          timeSeriesElevIndex = i;
      }
      // Set up elev and flow Values
      let elevValues = '';
      let flowValues = '';
      elevValues = data.value.timeSeries[timeSeriesElevIndex].values[valuesIndex].value;
      // Reverse the order of our data so most recent date is first
      elevValues.reverse();

      if (timeSeriesFlowIndex >= 0) { // if there is flow data, then set the flowValues
        flowValues = data.value.timeSeries[timeSeriesFlowIndex].values[valuesIndex].value;
        // Reverse the order of our data so most recent date is first
        flowValues.reverse();
      }

      // If reported level is not based on MSL, set the seaLevelDelta to add to the level
      // to convert to MSL based.
      if (seaLevelDelta !== 0)
        elevationAdjust = (parseFloat(elevValues[0].value) + Number(seaLevelDelta)).toFixed(2);
      else {
        if (lakePool !== 0)
          elevationAdjust = elevValues[0].value;
        else elevationAdjust = elevValues[0].value;
      }

      // Set current Date, Time and Elev
      currentElev = elevationAdjust;
      let splitTimeDate = elevValues[0].dateTime.split("T");
      currentDate = splitTimeDate[0];
      currentTime = splitTimeDate[1].substring(0, 5);
      currentDelta = (currentElev - lakePool).toFixed(2);

      // Create our increment and loop through each value
      // For each value push an object into displayBatch
      // Set our counter K variable before incrementing for flowUSGS to use
      // k = j;
      if (elevValues.length <= 100) // If we only get 93 data values when we requested 96 hours, then it's hourly
        jIncrement = 1;
      else if (['Hudson', 'Lawtonka'].includes(bodyOfWater)) jIncrement = 2;
      else jIncrement = 4;
      for (j = 0; j < elevValues.length; j += jIncrement) {
        let element = elevValues[j];
        let elev = element.value;
        // let splitTimeDate = element.dateTime.split("T");
        // let date = splitTimeDate[0].substring(2, 10).replace('-', ' ');
        // let time = splitTimeDate[1].substring(0, 5);
        let timestamp = element.dateTime;
        let flow = "N/A";
        if (timeSeriesFlowIndex >= 0)
          flow = flowValues[j].value;
        // adjust the elev for lakes with data relative to full pool (not from sealevel))
        if (seaLevelDelta !== 0) {
          elev = (parseFloat(elevValues[j].value) + Number(seaLevelDelta)).toFixed(2);
        }

        // split time and date for database 
        // this simple split leaves the time in -5:00 GMT (Central Time)
        let dateSplit = timestamp.split("T");
        let databaseDate = dateSplit[0];
        let databaseTime = dateSplit[1].substring(0, 5);

        displayBatch.push({
          date: databaseDate,
          time: databaseTime,
          elev: elev,
          flow: flow
        });
      }

    }
    callback(null, displayBatch);
  })
}

// function to update the db with usgs data
function updateUSGSDB() {
  // find documents with USGS in the dataSource
  db.model("State").find(
    { "lakes.dataSource": "USGS" }
  )
    .exec(function (err, data) {
      if (err) {
        console.log("There was a problem querying the database");
      } else {
        // loop through the documents
        data.forEach(function (state) {
          state.lakes.forEach(function (lake) {
            // filter each lake once more to see if dataSource array includes USGS
            if (lake.dataSource.includes("USGS")) {
              // run the getData function
              getUSGSData(lake.elevURL, lake.bodyOfWater, lake.seaLevelDelta, function (error, data) {
                if (error) {
                  console.log(error);
                  return;
                  // if successful update the database
                } else {
                  db.model("State").updateMany(
                    { "lakes.bodyOfWater": lake.bodyOfWater },
                    {
                      $addToSet: {
                        "lakes.$.data": { $each: data }
                      }
                    },
                    { upsert: true }
                  )
                    .then(function () {
                      console.log(lake.bodyOfWater + " Update Complete (USGS)");
                    })
                    .catch(function (err) {
                      console.log(err);
                    });
                }
              });
            }
          })
        })
      }
    });
}
// run the function once and then again every 20 minutes 
updateUSGSDB();
setInterval(updateUSGSDB, 1200000);






