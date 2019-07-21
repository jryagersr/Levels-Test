const db = require("../../models")();

module.exports = {

  // WEATHER DATA UPDATE FUNCTION
  // ===============================================================================
  // function to get WEATHER data
  getWeatherData: function (currentLake, callback) {
    var request = require("request");
    var data = []; //Retrieve Weather Data 
    //Weather data URLs
    let apiKey = "d620419cfbb975f425c6262fefeef8f3";
    let weatherURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + currentLake.lat + "&lon=" + currentLake.long + "&units=imperial&APPID=" + apiKey;
    let forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + currentLake.lat + "&lon=" + currentLake.long + "&units=imperial&APPID=" + apiKey;
    request(weatherURL, function (error, response, body) {
      if (error) {
        callback(false, error);
      } else {
        let dataErrorTrue = false;
        try {
          data = JSON.parse(body);
        } catch (error) {
          console.error(error);
          dataErrorTrue = true;
        }

        if (!dataErrorTrue) {

          if (typeof data == "undefined") {
            console.log(`No baro data for ${bodyOfWater}`);
            // send empty array to front end
          } else {

            callback(false, data);
          }
        } else {
          console.log(`Data is bad for ${bodyOfWater} (Weather)`);
          callback(true, body);
        }

      }
    })
  }

}
/*
          //Retrieve Weather Data 
          //Weather data URLs
          let apiKey = "d620419cfbb975f425c6262fefeef8f3";
          let weatherUrl = "http://api.openweathermap.org/data/2.5/weather?lat=" + currentLake.lat + "&lon=" + currentLake.long + "&units=imperial&APPID=" + apiKey;
          let forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + currentLake.lat + "&lon=" + currentLake.long + "&units=imperial&APPID=" + apiKey;

          //Check to see if weather needs to be updated for lake
          //Fetch current weather Data
          //console.log(`Weather call for ${currentLake.bodyOfWater}`)
          request(weatherUrl, function (error, currentCond) {
            if (error) {
              console.log(error);
            } else {
              //    console.log(`Weather return for ${currentLake.bodyOfWater}`);
              //process current weather data
              //console.log(currentCond)              
            }
          })
          /*        //Fetch weather forecast data
          //Fetch current weather Data       
          request(forecastUrl, function (error, response, forecast) {
            if (error) {
              console.log(error);
            } else {
              //process forecast weather data
            console.log(forecast)
            }
          })
*/