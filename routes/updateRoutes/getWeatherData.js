const db = require("../../models")();

module.exports = {

  // WEATHER DATA UPDATE FUNCTION
  // ===============================================================================
  // function to get WEATHER data
  getWeatherData: function (currentLake, callback) {
    var request = require("request");
    var wxData = []; //Retrieve Weather Data 
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
          wxData = JSON.parse(body);
        } catch (error) {
          console.error(error);
          dataErrorTrue = true;
        }

        if (!dataErrorTrue) {

          if (typeof wxData == "undefined") {
            console.log(`No Wx data for ${wxData.bodyOfWater}`);
            // send empty array to front end
          } else { 
            
            // Set weather
            let today = new Date()
            let compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
            lakeWeather.barometric = wxData.main.pressure;
            lakeWeather.wxTemp = wxData.main.temp;
            lakeWeather.humidity = wxData.main.humidity;
            lakeWeather.windSpeed = wxData.wind.speed;
            lakeWeather.windDirection = compassSector[(wxData.wind.deg / 22.5).toFixed(0)];
            lakeWeather.conditions = wxData.weather[0].description;
            lakeWeather.conditions = lakeWeather.conditions.charAt(0).toUpperCase() + lakeWeather.conditions.slice(1);
            lakeWeather.wxDate = today.toLocaleDateString();
            lakeWeather.wxTime = today.toLocaleTimeString('en-US') + " (" + wxData.name + ")";

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