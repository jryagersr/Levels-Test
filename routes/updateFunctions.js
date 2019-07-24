const db = require("../models")();
// Import all data source update functions

const weather = require("./updateRoutes/getWeatherData");
var update = require('./updateFunctions');


module.exports = {

  // ===============================================================================
  // UPDATE FUNCTIONS
  // ===============================================================================

  // check to see if an update is needed (true = update is needed);
  checkForUpdate: function (currentLake) {
    let lastRefresh = currentLake.lastRefresh;
    let refreshInterval = currentLake.refreshInterval;
    let dataLength = currentLake.data.length;

    // set today's date for comparison and find minute difference
    let today = new Date();
    let diffMins = 2400; // default setting to force update
    // check to make sure previous data exists
    if (dataLength > 0) {
      let msMinute = 60 * 1000;
      let msDay = 60 * 60 * 24 * 1000;
      let lastUpdate = new Date(lastRefresh);
      let diffDays = (today - lastUpdate) / msDay; // calculate diff in days
      if (diffDays > 1) {
        return true;
      }
      diffMins = Math.round((today - lastUpdate) / 60000); // minutes
    }
    if (diffMins > refreshInterval) {
      return true;
    } else {
      return false;
    }
  },

  // function to update and return one lake
  updateAndReturnOneLake: function (currentLake, UROLdata, callback) {
    // if new data exists, set the last Refresh time
    let updateData = UROLdata;
    let lastRefresh = currentLake.lastRefresh;
    let bodyOfWater = currentLake.bodyOfWater;
    let callbackError = false;

    lakeUpdateFlag = false;
    if (typeof updateData == "undefined") {
      console.log(`Undefined data sent to uAROL ${bodyOfWater}`);
      callbackError = true;
      callback(callbackError, lakeUpdateFlag, updateData);
    } else {
      // Update the current conditions and forecast for this lake

      // Get weather data
      //if (checkForUpdate(currentLake.lastRefresh, currentLake.refreshInterval, currentLake.data.length)) {
      // Get 
      weather.getWeatherData(currentLake, function (error, currentConditions) {
        const currentConditionsData = currentConditions;
        if (error) {
          console.log(`Weather retrieval error ${error}`)
          callbackError = true;
        } else {
          if (currentConditionsData !== 'undefined') {
            // Set weather
            let today = new Date()
            let compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
            currentLake.barometric = currentConditionsData.main.pressure;
            currentLake.wxTemp = currentConditionsData.main.temp;
            currentLake.humidity = currentConditionsData.main.humidity;
            currentLake.windSpeed = currentConditionsData.wind.speed;
            currentLake.windDirection = compassSector[(currentConditionsData.wind.deg / 22.5).toFixed(0) - 1];
            currentLake.conditions = currentConditionsData.weather[0].description;
            currentLake.conditions = currentLake.conditions.charAt(0).toUpperCase() + currentLake.conditions.slice(1);
            currentLake.wxDate = today.toLocaleDateString();
            currentLake.wxTime = today.toLocaleTimeString('en-US');

          } else {
            console.log(`Data error for weather ${currentLake.bodyOfWater}`);
          }
        }
        // update the data base
        if (updateData.length > 0) {
          if (lastRefresh !== UROLdata[0].time.toString()) {
            //console.log(`${bodyOfWater} Updated `)
            lakeUpdateFlag = true;
            lastRefresh = updateData[0].time.toString();
          }
          // use updateData to update the lake data
          db.model("Lake").findOneAndUpdate({
              "bodyOfWater": bodyOfWater
            }, {
              $push: {
                "data": {
                  $each: updateData,
                  $sort: {
                    time: -1
                  },
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
            .exec(function (err, updateData) {
              if (err) {
                console.log(err);
                callbackError = true;
                callback(callbackError, lakeUpdateFlag, currentLake);
              } else {

                // Check to make sure there is enough data before de-duping
                if (updateData.data.length > 1) {
                  // while the first two entries still have dupes
                  //console.log(updatedLake.bodyOfWater);
                  // loop through the data, beginning at first index
                  for (var i = 1; i < updateData.data.length; i++) {
                    // check to see if there are two duplicate entrys
                    // convert timestamps to strings to avoid millisecond differences
                    if (updateData.data[i].time.toString() == updateData.data[i - 1].time.toString()) {
                      // remove the oldest entry
                      updateData.data.splice(i - 1, 1);
                    }
                  }
                }
                // update the database with the 'clean' data
                db.model("Lake").updateOne({
                    'bodyOfWater': bodyOfWater
                  }, {
                    $set: {
                      "data": updateData.data
                    }
                  })
                  .exec(function (err) {
                    if (err) {
                      console.log(error);
                    } else {


                      // Set weather
                      let today = new Date()
                      let compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
                      updateData.barometric = currentLake.barometric;
                      updateData.wxTemp = currentLake.wxTemp;
                      updateData.humidity = currentLake.humidity;
                      updateData.windSpeed = currentLake.windSpeed;
                      updateData.windDirection = currentLake.windDirection;
                      updateData.conditions = currentLake.conditions;
                      updateData.wxDate = currentLake.wxDate;
                      updateData.wxTime = currentLake.wxTime;

                      callbackError = false;

                      callback(callbackError, lakeUpdateFlag, updateData);

                    }
                  })
                // log that the lake was updated and return it
                //console.log(`UPDATE COMPLETE for ${updateData.bodyOfWater} (${updateData.dataSource[0]})`);

              }
            });
        }
      });
    }
  }

}