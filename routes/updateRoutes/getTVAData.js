const request = require("request");
const _ = require("underscore");
const db = require("../../models")();
const update = require('../updateFunctions');
const weather = require("../updateRoutes/getWeatherData");


module.exports = {

  // TVA UPDATE FUNCTION
  // ===============================================================================
  // function to get TVA data
  getTVAData: function (currentLake, callback) {
    var data = [];
    var waterData = [];
    let thisLake = currentLake;
    let newUrl = thisLake.elevURL;
    let bodyOfWater = thisLake.bodyOfWater;

    var options = {
      url: newUrl,
      type: "xml"
    }
    request(options, function (error, response, body) {
      if (error) {
        callback(true, error, body);
      } else {

        let dataErrorTrue = false;
        try {
          data = JSON.parse(body);
        } catch (error) {
          dataErrorTrue = true;
        }

        if (!dataErrorTrue) {

          _.each(data, function (dataSet) {
            if (dataSet[0] !== "Day") {
              // format timestamp for database
              console.log (dataSet)
              let splitTime = dataSet[1].split(" ");
              let splitDate = dataSet[0].split("/");
              let year = splitDate[2];
              let month = parseInt(splitDate[0]) - 1; //JS counts numbers from 0-11 (ex. 0 = January)
              let day = splitDate[1];
              let hour = splitTime[0];

              if (splitTime[0] === "Midnight") {
                hour = 0;
              } else if (splitTime[0] == "Noon") {
                hour = 12;
              } else if (splitTime[1] === "PM")
                hour = parseInt(hour) + 12;
              let timestamp = new Date(year, month, day, hour);

              //Get the comma out of the flow and elev
              let tvaElev = Number(dataSet[2].trim().replace(",", ""));
              let tvaFlow = Number(dataSet[4].trim().replace(",", ""));

              waterData.push({
                time: timestamp,
                flow: tvaFlow,
                elev: tvaElev
              });
            };
          });


          callback(false, waterData.reverse());
        } else {
          console.log(`Data is bad for ${bodyOfWater} (TVA)`);
          callback(true, body);
        }
      }
    });
  }

}