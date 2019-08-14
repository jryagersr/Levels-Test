const db = require("../../models")();

module.exports = {

  // WEATHER DATA UPDATE FUNCTION
  // ===============================================================================
  // function to get WEATHER data
  getForecastData: function (currentLake, callback) {
    var request = require("request");
    var data = []; //Retrieve Weather Data 
    var lakeWeather = currentLake;

    //Weather data URLs
    let apiKey = "d620419cfbb975f425c6262fefeef8f3";
    let forecastURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lakeWeather.lat + "&lon=" + lakeWeather.long + "&units=imperial&APPID=" + apiKey;
    request(forecastURL, function (error, response, body) {
      let forecastData = body;
      if (error) {
        callback(false, error);
      } else {
        let dataErrorTrue = false;
        try {
          fxData = JSON.parse(forecastData);
        } catch (error) {
          console.error(error);
          dataErrorTrue = true;
        }

        if (!dataErrorTrue) {

          if (typeof fxData.list == "undefined") {
            console.log(`No Wx data for ${currentLake.bodyOfWater}`);
            // send empty array to front end
          } else {

            // Empty the forecast data object
            currentLake.wxForecastData = [];

            // Set weather
            let today = new Date()
            let forecastDay = "";
            let currentForecastDay = "";
            let maxTemp = 0;
            let minTemp = 100;
            let maxHumidity = 0;
            let maxWind = 0;
            let maxWindDirection = "";
            let Day = 0;
            let previousDay = "";
            let compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
            fxData.list.forEach(function (element, i) {
              forecastDay = element.dt_txt.substr(8, 2);

              // If the Day changed or it is the first element
              if (currentForecastDay == forecastDay || i == 0) {
                // update the currentForecastDay
                currentForecastDay = forecastDay;

                // determine the forecast data for the day
                if (element.main.temp > maxTemp)
                  maxTemp = element.main.temp;

                if (element.main.temp < minTemp)
                  minTemp = element.main.temp;

                if (element.main.humidity > maxHumidity)
                  maxHumidity = element.main.humidity;

                if (element.wind.speed > maxWind) {
                  maxWind = element.wind.speed;
                  maxWindDirection = compassSector[(element.wind.deg / 22.5).toFixed(0) - 1];
                }
                // push hourly  (3hr) data to wxForecastData
                currentLake.wxForecastData.push({
                  time: element.dt_txt,
                  conditions: element.weather[0].description.charAt(0).toUpperCase() + element.weather[0].description.slice(1),
                  temp: element.main.temp,
                  humidity: element.main.humidity,
                  windspeed: element.wind.speed,
                  winddirection: compassSector[(element.wind.deg / 22.5).toFixed(0) - 1]

                });

                previousDay = element.dt_txt;
              } else {

                Day++

                //push Forecast Day data to wxForecastData
                currentLake.wxForecastData.push({
                  day: Day,
                  time: previousDay,
                  conditions: element.weather[0].description.charAt(0).toUpperCase() + element.weather[0].description.slice(1),
                  high: maxTemp,
                  low: minTemp,
                  humidity: element.main.humidity,
                  windspeed: element.wind.speed,
                  winddirection: compassSector[(element.wind.deg / 22.5).toFixed(0) - 1]
                });

                // reset the forecast Day
                currentForecastDay = forecastDay

                //Put current element data in forecast Day 
                // determine the forecast data for the day

                maxTemp = element.main.temp;
                minTemp = element.main.temp;
                maxHumidity = element.main.humidity;
                maxWind = element.wind.speed;
                maxWindDirection = compassSector[(element.wind.deg / 22.5).toFixed(0) - 1];

                // push hourly  (3hr) data to wxForecastData
                currentLake.wxForecastData.push({
                  time: element.dt_txt,
                  conditions: element.weather[0].description.charAt(0).toUpperCase() + element.weather[0].description.slice(1),
                  temp: element.main.temp,
                  humidity: element.main.humidity,
                  windspeed: element.wind.speed,
                  winddirection: compassSector[(element.wind.deg / 22.5).toFixed(0) - 1]
                });

              }
              if (i == fxData.list.length - 1) {
                Day++

                //push Forecast Day data to wxForecastData
                currentLake.wxForecastData.push({
                  day: Day,
                  time: element.dt_txt,
                  conditions: element.weather[0].description.charAt(0).toUpperCase() + element.weather[0].description.slice(1),
                  high: maxTemp,
                  low: minTemp,
                  humidity: element.main.humidity,
                  windspeed: element.wind.speed,
                  winddirection: compassSector[(element.wind.deg / 22.5).toFixed(0) - 1]
                });

              }

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