const request = require("request");
const _ = require("underscore");
const db = require("../../models")();
const update = require('../updateFunctions');


module.exports = {

  // TVA UPDATE FUNCTION
  // ===============================================================================
  // function to get TVA data
  getTVAData: function (newUrl, bodyOfWater, callback) {
    var data = [];
    var waterData = [];
    var options = {
      url: newUrl,
      type: "xml"
    }
    request(options, function (error, response, body) {
      if (error) {
        callback(error);
      }


      let dataErrorTrue = false;
      try {
        data = JSON.parse(body);
      } catch (error) {
        console.error(error);
        dataErrorTrue = true;
      }

      if (!dataErrorTrue) {

        _.each(data, function (dataSet) {
          if (dataSet[0] !== "Day") {

            // format timestamp for database
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
            //Get the comma out of the flow

            let tvaFlow = Number(dataSet[4].trim().replace(",", ""));

            waterData.push({
              time: timestamp,
              flow: tvaFlow,
              elev: dataSet[2]
            });
          };
        });


        callback(null, waterData.reverse());
      } else {
        console.log(`Data is bad for ${bodyOfWater} (TVA)`);
        callback(null, body);
      }
    });
  }

}