const db = require("../models")();
// Import all data source update functions
const ace = require("./updateRoutes/getACEData");
const cube = require("./updateRoutes/getCUBEData");
const duke = require("./updateRoutes/getDUKEData");
const sjrwmd = require("./updateRoutes/getSJRWMDData");
const tva = require("./updateRoutes/getTVAData");
const twdb = require("./updateRoutes/getTWDBData");
const usgs = require("./updateRoutes/getUSGSData");
const uslakes = require("./updateRoutes/getUSLAKESData");


module.exports = {

  // ===============================================================================
  // UPDATE FUNCTIONS
  // ===============================================================================

  // check to see if an update is needed (true = update is needed);
  checkForUpdate: function (lastRefresh, refreshInterval, dataLength) {
    // set today's date for comparison and find minute difference
    let today = new Date();
    let diffMins = 2400; // default setting to force update
    // check to make sure previous data exists
    if (dataLength > 0) {
      let msMinute = 60 * 1000;
      let msDay = 60 * 60 * 24 * 1000;
      let lastUpdate = new Date(lastRefresh);
      let diffDays = Math.floor((today - lastUpdate) / msDay); // calculate diff in days
      if (diffDays > 1) {
        return true;
      }
      diffMins = Math.floor(((today - lastUpdate) % msDay) / msMinute) //calculate diff in minutes
    }
    if (diffMins > refreshInterval) {
      return true;
    } else {
      return false;
    }
  },

  // function to update and return one lake
  updateAndReturnOneLake: function (bodyOfWater, lastRefresh, data, callback) {
    // if new data exists, set the last Refresh time
    if (data.length > 0) {
      lastRefresh = data[0].time;
    }
    // use updateData to update the lake data
    db.model("Lake").findOneAndUpdate({
      "bodyOfWater": bodyOfWater
    },
      {
        $push: {
          "data": {
            $each: data,
            $sort: { time: -1 },
            position: 0
          }
        },
        $set: {
          "lastRefresh": lastRefresh
        }
      }, {
        upsert: true,
        useFindAndModify: false,
        new: true
      })
      .exec(function (err, data) {
        if (err) {
          console.log(err);
        } else {
          let updatedLake = data;

          // Check to make sure there is enough data before de-duping
          if (updatedLake.data.length > 1) {
            // while the first two entries still have dupes
            console.log(updatedLake.bodyOfWater);
              // loop through the data, beginning at first index
              for (var i = 1; i < updatedLake.data.length; i++) {
                // check to see if there are two duplicate entrys
                // convert timestamps to strings to avoid millisecond differences
                if (updatedLake.data[i].time.toString() == updatedLake.data[i - 1].time.toString()) {
                  // remove the oldest entry
                  updatedLake.data.splice(i - 1, 1);
                }
              }
          }
          // log that the lake was updated and return it
          console.log(`Update completed for ${updatedLake.bodyOfWater} (${updatedLake.dataSource[0]})`);
          callback(null, updatedLake);
          // update the database with the 'clean' data
          db.model("Lake").updateOne(
            { 'bodyOfWater': bodyOfWater },
            { $set: { "data": updatedLake.data } }
          )
            .exec(function (err) {
              if (err) {
                console.log(error);
              }
            })
        }
      });
  }

}