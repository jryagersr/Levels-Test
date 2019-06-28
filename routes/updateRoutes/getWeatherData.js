const db = require("../../models")();

module.exports = {

  // WEATHER DATA UPDATE FUNCTION
  // ===============================================================================
  // function to get WEATHER data
  getWeatherData: function (weatherURL, bodyOfWater, normalPool, elevInterval, callback) {
    var request = require("request");
    var data = [];
    request(a2wURL, function (error, response, body) {
      if (error) {
        callback(error);
      } else {
        let dataErrorTrue = false;
        try {
          data = JSON.parse(body);
        } catch (error) {
          console.error(error);
          dataErrorTrue = true;
        }

        if (!dataErrorTrue) {
          // let data = JSON.parse(body);
          let elevEntries = [];
          let flowEntries = [];
          let exportData = [];
          // loop through our json data
          data.forEach(object => {
            //Check to see if weather needs to be updated for lake
            if (false) {
              //Fetch current weather Data
              //console.log(`Weather call for ${currentLake.bodyOfWater}`)
              request(weatherUrl, function (error, currentCond) {
                if (error) {
                  console.log("Weather " + currentLake.bodyOfWater)
                  console.log(error);
                } else {
                  weatherData = JSON.parse(currentCond.body)
                  weatherDataRequests++;
                  //    console.log(`Weather return for ${currentLake.bodyOfWater}`);
                  //process current weather data
                  //console.log(currentCond)              
                }
              })
            }
           
          })
          if (typeof baro == "undefined") {
            console.log(`No elev data for ${bodyOfWater} (ACE)`);
            // send empty array to front end
          } else {
            callback(null, exportData);
          }
        } else {
          console.log(`Data is bad for ${bodyOfWater} (ACE)`);
          callback(null, body);
        }

      }
    })
  }

}