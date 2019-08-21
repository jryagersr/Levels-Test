const db = require("../../models")();

module.exports = {

  // WEATHER DATA UPDATE FUNCTION
  // ===============================================================================
  // function to get WEATHER data
  getWeatherData: function (currentLake, callback) {
    var request = require("request");
    let wxData = []; //Retrieve Weather Data 
    let lakeWeather = currentLake;

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

            // if there are more than one day of entries, pop one off the array.
            while (lakeWeather.ccWxData.length > 23)
              lakeWeather.ccWxData.pop();

            if (typeof wxData == "undefined") {
              console.log(`No Wx data for ${wxData.bodyOfWater}`);
            }

            // push the current conditions into ccWxData[] and update the LastRefresh
            let timeStamp = Date(wxData.dt);
            //set timeStamp for current conditions to 0 minutes, 0 seconds
            timeStamp = timeStamp.substring(0, timeStamp.indexOf(":")) + ":00:00 " + timeStamp.substring(timeStamp.indexOf(":") + 7, timeStamp.length);

            lakeWeather.ccWxDataLastRefresh = timeStamp
            lakeWeather.ccWxData.push({
              conditions: wxData.weather[0].description.charAt(0).toUpperCase() + wxData.weather[0].description.slice(1),
              date: Date(wxData.dt),
              time: today.toLocaleTimeString('en-US'),
              location: wxData.name, // for current Conditions Well
              baro: wxData.main.pressure,
              temp: wxData.main.temp,
              humidity: wxData.main.humidity,
              windspeed: wxData.wind.speed,
              winddirection: compassSector[(wxData.wind.deg / 22.5).toFixed(0)]
            });

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