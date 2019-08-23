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
  checkForUpdate: function (currentLake, type) { // type - 0 = lake leves 1 = current conditions 2 - forecast, default = 0
    let lastRefresh = currentLake.lastRefresh; // to prevent re-entrant code problems
    let refreshInterval = currentLake.refreshInterval; //
    let dataLength = currentLake.data.length;
    if (type == 1) { // check current conditions weather refresh interval
      lastRefresh = currentLake.ccWxDataLastRefresh; // Set to current conditions lastRefresh
      refreshInterval = 60; // current conditions are all updated every hour
      dataLength = currentLake.ccWxData.length;
    }
    if (type == 2) { // check forecast weather refresh interval
      lastRefresh = currentLake.wxForecastDataLastRefresh; // Set to forecast lastRefresh
      refreshInterval = 180; // forecat data updated every 3 hrs
      dataLength = currentLake.wxForecastData.length;
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
        return true;
      }
      diffMins = Math.round((today - lastUpdate) / 60000); // minutes
    }
    if (diffMins >= refreshInterval) {
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
      if (updateData.length > 0) {
        if (lastRefresh !== UROLdata[0].time.toString()) {
          //console.log(`${bodyOfWater} Updated `)
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
    weather.getWeatherData(ccLake, function (error, data) {
      let newLakeCC = data;
      if (error) {
        console.log(`Weather retrieval error (updateFunction) ${error}`)
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

        //set timeStamp for current conditions to 0 minutes, 0 seconds
        //console.log (`${timeStamp} value ${ccLake.ccWxDataLastRefresh}`)
        timeStamp = timeStamp.substring(0, timeStamp.indexOf(":")) + ":00:00 " + timeStamp.substring(timeStamp.indexOf(":") + 7, timeStamp.length);

        //console.log (`${bodyOfWater} Current Conditions updated (db) ${timeStamp}`)

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
              //console.log(lakeWeather.ccWxData)
              return true;
            }
          });
      }

    })
  },

  // function to update forecast data
  updateForecastData: function (currentLake) {

    // Get weather forecast data


    //if (checkForUpdate(currentLake.lastRefresh, currentLake.refreshInterval, currentLake.data.length)) {
    // Should be every 60minutes


    // Get 

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
        }
        db.model("Lake").updateOne({
            'bodyOfWater': bodyOfWater
          }, {
            $set: {
              "wxForecastData": currentLake.wxForecastData
            }
          })
          .exec(function (err, wxForecastData) {
            if (err) {
              console.log(err);
            } else {
              //console.log(wxData)
            }
          });

      }
    });

  }

}