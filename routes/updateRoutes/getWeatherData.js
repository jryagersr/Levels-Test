const db = require("../../models")();

module.exports = {

  // WEATHER DATA UPDATE FUNCTION
  // ===============================================================================
  // function to get WEATHER data
  getWeatherData: function (currentLake, callback) {
    var request = require("request");
    var data = []; //Retrieve Weather Data 
    var lakeWeather = currentLake;

    //Weather data URLs
    let apiKey = "d620419cfbb975f425c6262fefeef8f3";
    let weatherURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lakeWeather.lat + "&lon=" + lakeWeather.long + "&units=imperial&APPID=" + apiKey;
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
            console.log(`No Wx data for ${bodyOfWater}`);
            // send empty array to front end
          } else { 
            
            // Set weather
            let today = new Date()
            let compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
            lakeWeather.barometric = data.main.pressure;
            lakeWeather.wxTemp = data.main.temp;
            lakeWeather.humidity = data.main.humidity;
            lakeWeather.windSpeed = data.wind.speed;
            lakeWeather.windDirection = compassSector[(data.wind.deg / 22.5).toFixed(0) - 1];
            lakeWeather.conditions = data.weather[0].description;
            lakeWeather.conditions = lakeWeather.conditions.charAt(0).toUpperCase() + lakeWeather.conditions.slice(1);
            lakeWeather.wxDate = today.toLocaleDateString();
            lakeWeather.wxTime = today.toLocaleTimeString('en-US') + " (" + data.name + ")";

            callback(false, lakeWeather);
          }
        } else {
          console.log(`Wx data is bad for ${lakeWeather.bodyOfWater}`);
          callback(true, body);
        }

      }
    })
  }

}