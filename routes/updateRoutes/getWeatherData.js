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
      if (error ||
        (body.search("Your account is temporary blocked") > -1) || // Overran our 60/minute limit
        (body.search('Internal error:') > -1) ||
        (body.search('undefined is not a float') > -1) ||
        (body.search('error') > -1) ||
        (body.search('Error') > -1)
      ) { // OpenWeather had a problem
        dataErrorTrue = true;
        if (error ||
          typeof wxData.message == 'undefined' ||
          wxData.message.includes('Internal error:')) {
          console.log(`Error retrieving Wx Data for ${currentLake.bodyOfWater} - ${error}`);
          if (wxData.message == 'Internal error: 00000') // does not return true or data for 'error'
            console.log(`wxData retrieval - ${wxData.message}`)
        } else if (body.search("Your account is temporary blocked") > -1)
          console.log(`${lakeWeather.bodyOfWater} - Wx Error - Cod: 429 Exceeded Subscription limit`)
        callback(true, error);
      } else {
        let dataErrorTrue = false;
        try {
          wxData = JSON.parse(body);
        } catch (error) {
          console.error(error);
          dataErrorTrue = true;
          callback(true, error);
        }

        if (!dataErrorTrue) {
          if (typeof wxData.weather !== 'object')
            console.log(`${body}`)

          if (typeof wxData == "undefined") {
            console.log(`No Wx data for ${wxData.bodyOfWater}`);
            // send empty array to front end
          } else {

            // Set weather
            let today = new Date()
            let compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
            if (typeof (wxData.weather[0].description == "String"))
              dataErrorTrue = dataErrorTrue;
            let conditionsString = wxData.weather[0].description.charAt(0).toUpperCase() + wxData.weather[0].description.slice(1);

            // if there are more than one day of entries, pop one off the array.
            while (lakeWeather.ccWxData.length > 23)
              lakeWeather.ccWxData.shift();

            if (typeof wxData == "undefined") {
              console.log(`No Wx data for ${wxData.bodyOfWater}`);
            }

            // push the current conditions into ccWxData[] and update the LastRefresh
            let wxTimeStamp = Date(wxData.dt);
            //set timestamp for current conditions to 0 minutes, 0 seconds
            wxTimeStamp = wxTimeStamp.substring(0, wxTimeStamp.indexOf(":")) + ":00:00 " + wxTimeStamp.substring(wxTimeStamp.indexOf(":") + 7, wxTimeStamp.length);

            lakeWeather.ccWxDataLastRefresh = wxTimeStamp
            lakeWeather.ccWxData.push({
              conditions: conditionsString,
              date: new Date(),
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