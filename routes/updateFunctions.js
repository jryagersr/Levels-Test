const db = require("../models")();
// Import all data source update functions

const weather = require("./updateRoutes/getWeatherData");
const forecast = require("./updateRoutes/getForecastData");
var update = require('./updateFunctions');


module.exports = {

  // ===============================================================================
  // UPDATE FUNCTIONS
  // ===============================================================================

  // check to see if an update is needed (true = update is needed);
  checkForUpdate: function (currentLake, type) { // type - 0 = lake level 1 = current conditions 2 - forecast, default = 0
    let cLake = currentLake;
    let lastRefresh = cLake.lastRefresh; // to prevent re-entrant code problems
    let refreshInterval = cLake.refreshInterval; // default to lake data refresh check
    let dataLength = cLake.data.length;
    let status = false;

    if (type == 1) { // check current conditions weather refresh interval
      lastRefresh = cLake.ccWxDataLastRefresh; // Set to current conditions lastRefresh
      refreshInterval = 60; // current conditions are all updated every hour
      if (cLake.ccWxData == null) {
        dataLength = 0;
        console.log(`${cLake.bodyOfWater} ccWxData is null`)
      } else dataLength = cLake.ccWxData.length;
    }
    if (type == 2) { // check forecast weather refresh interval
      lastRefresh = cLake.wxForecastDataLastRefresh; // Set to forecast lastRefresh
      refreshInterval = 180; // forecat data updated every 3 hrs
      dataLength = cLake.wxForecastData.length;
    }

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
        status = true;
      }
      diffMins = Math.round((today - lastUpdate) / 60000); // minutes
    }
    //If time for an update or the refreshInterval is corrupted
    if (diffMins >= refreshInterval || currentLake.lastRefresh == "Invalid Date") {
      status = true;
    } else {
      status = false;
    }
    return status;
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
      if (updateData.length > 0) {
        if (lastRefresh !== UROLdata[0].time.toString()) {
          lakeUpdateFlag = true;
          lastRefresh = updateData[0].time.toString();
        }

        // use updateData to update the lake time elev, flow, data
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
              console.log(err + "UpdateFunction .exec");
              callbackError = true;
              callback(callbackError, lakeUpdateFlag, currentLake);
            } else {

              // Check to make sure there is enough data before de-duping
              if (updateData.data.length > 1) {
                // while the first two entries still have dupes
                // loop through the data, beginning at first index
                for (var i = 1; i < updateData.data.length; i++) {
                  // check to see if there are two duplicate entrys
                  // convert timestamps to strings to avoid millisecond differences
                  if (updateData.data[i].time.toString().substring(0, 25) == updateData.data[i - 1].time.toString().substring(0, 25)) {
                    // remove the oldest entry or a zero average level (not sure how a zero got into the data
                    // based on the the getDUKEData code, but it did for all but two of the Duke lakes.)
                    if (updateData.data[i].flow == "Missing") {
                      updateData.data.splice(i, 1);
                    } else {
                      updateData.data.splice(i - 1, 1);
                    }
                    i--;
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

                    callbackError = false;
                    callback(callbackError, lakeUpdateFlag, updateData);

                  }
                })
              // log that the lake was updated and return it
              //console.log(`UPDATE COMPLETE for ${updateData.bodyOfWater} (${updateData.dataSource[0]})`);

            }
          });
      }
    }
  },



  // function to update and return one lake
  updateCurrentConditionsData: function (currentLake) {
    let ccLake = currentLake
    let bodyOfWater = ccLake.bodyOfWater;

    // Update the current conditions and forecast for this lake

    // Get weather data
    weather.getWeatherData(currentLake, function (error, data) {
      let newLakeCC = data;
      if (error) {
        console.log(`Weather retrieval error (updateFunction) ${currentLake.bodyOfWater}`)
        callbackError = true;
        console.log(`Forecast Data for ${bodyOfWater} failed`)
        return false;
      } else {
        if (newLakeCC !== 'undefined') {
          weatherData = true;

        } else {
          console.log(`Data error for weather ${bodyOfWater}`);
        }

        // if there are 24 in ccWxData, pop one off

        // push the current conditions into ccWxData[] and update the LastRefresh
        let timeStamp = newLakeCC.ccWxDataLastRefresh;

        db.model("Lake").updateOne({
            'bodyOfWater': bodyOfWater
          }, {
            $set: {
              "ccWxData": newLakeCC.ccWxData,

              "ccWxDataLastRefresh": timeStamp
            }
          })
          .exec(function (err, ccWxData) {
            if (err) {
              console.log(err);
            } else {
              return true;
            }
          });
      }

    })
  },

  // function to update forecast data
  updateForecastData: function (currentLake) {

    // Get weather forecast data

    forecast.getForecastData(currentLake, function (error, lakeForecast) {
      let forecastLake = lakeForecast;
      //let fxData = [];
      let bodyOfWater = forecastLake.bodyOfWater;
      if (error) {
        console.log(`Weather retrieval error (updateFunction) ${error}`)
        callbackError = true;
      } else {

        if (forecastLake !== 'undefined') {
          currentLake = forecastLake;

        } // push the current conditions into wxForecastData[] and update the LastRefresh
        let timeStamp = currentLake.wxForecastDataLastRefresh;

        db.model("Lake").updateOne({
            'bodyOfWater': bodyOfWater
          }, {
            $set: {
              "wxForecastData": currentLake.wxForecastData,

              "wxForecastDataLastRefresh": timeStamp
            }
          })
          .exec(function (err, wxForecastData) {
            if (err) {
              console.log(err);
            }
          });

      }
    });

  }

}