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
  checkForUpdate: function (currentLake) {
    let lastRefresh = currentLake.lastRefresh; // to prevent re-entrant code problems
    let refreshInterval = currentLake.refreshInterval; //
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
      //if (checkForUpdate(currentLake.lastRefresh, currentLake.refreshInterval, currentLake.data.length)) {

      // Need to decide when


      // Get 





      weather.getWeatherData(currentLake, function (error, data) {
        lakeWeather = data;
        let wxData = [];
        let weatherData = false;
        if (error) {
          console.log(`Weather retrieval error (updateFunction) ${error}`)
          callbackError = true;
        } else {
          if (currentLake !== 'undefined') {
            weatherData = true;

          } else {
            console.log(`Data error for weather ${lakeWeather.bodyOfWater}`);
          }
        }

        // update the data base with Current Weather
        // This is the check to see if we have lake data to update, if not, no weather update either
        if (updateData.length > 0) {
          if (lastRefresh !== UROLdata[0].time.toString()) {
            //console.log(`${bodyOfWater} Updated `)
            lakeUpdateFlag = true;
            lastRefresh = updateData[0].time.toString();
          }
          // Set up the Current Conditions data to be pushed as an object (Time, Baro, Temp, Humidity Wind, WDirection)

          wxData.push({
            time: updateData[0].time,
            baro: lakeWeather.barometric,
            temp: lakeWeather.wxTemp,
            humidity: lakeWeather.humidity,
            windspeed: lakeWeather.windSpeed,
            winddirection: lakeWeather.windDirection
          });


          // push the current conditions into ccWxData[]


          // use updateData to update the current conditions to the database
          db.model("Lake").updateOne({
              'bodyOfWater': bodyOfWater
            }, {
              $set: {
                "ccWxData": wxData
              }
            })
            .exec(function (err, ccWxData) {
              if (err) {
                console.log(err);
              } else {
                //console.log(wxData)
              }
            });


          if (lakeWeather.ccWxData.length > 24)
          lakeWeather.ccWxData.pop();

          // Get weather forecast data




          //if (checkForUpdate(currentLake.lastRefresh, currentLake.refreshInterval, currentLake.data.length)) {
          // Should be every 180minutes





          // Get 
          forecast.getForecastData(currentLake, function (error, lakeForecast) {
            let forecastLake = lakeForecast;
            //let fxData = [];
            let forecastData = false;
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
                if (weatherData) {
                  // Set weather
                  updateData.barometric = currentLake.barometric;
                  updateData.wxTemp = currentLake.wxTemp;
                  updateData.humidity = currentLake.humidity;
                  updateData.windSpeed = currentLake.windSpeed;
                  updateData.windDirection = currentLake.windDirection;
                  updateData.conditions = currentLake.conditions;
                  updateData.wxDate = currentLake.wxDate;
                  updateData.wxTime = currentLake.wxTime;
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
      });
    }
  }

}