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
    var options = {
      url: newUrl,
      type: "xml"
    }
    request(options, function (error, response, body) {
      if (error) {
        callback(error);
      }
      let tvaDate = "";
      let tvaTime = "";
      let tvaElev = "";
      let tvaOutFlow = "";
      let reformatDate = "";
      let tvaDateFormatted = "";
  

      if (typeof body !== 'undefined') {
      _.each(body.split("\r\n"), function (line) {
        var splitLine;
        line = line.trim();
  
        // Check to see if this is a data line by checking for keywords
        if (line.substring(1, 6) == "LOCAL") {
          // It's a date time line, save the date and time
          // Formulate the date 
          // Split the text body into readable lines
          splitLine = line.split(/[ ]+/);
          splitLine = splitLine[0].split(/[>]+/);
          tvaDate = splitLine[1];
          // Formulate the time
          splitLine = line.split(/[ ]+/);
          tvaTime = splitLine[1] + " " + splitLine[2] + " " + splitLine[3].substr(0, 3);
        }
  
        if (line.substring(1, 8) == "OBS_DAY") {
          // It's a Fontana Date line, isolate and save the date
          splitLine = line.split(/[>]+/);
          splitLine = splitLine[1].split(/[<]+/);
          tvaDate = splitLine[0];
        }
  
        if (line.substring(1, 7) == "OBS_HR") {
          // It's a Fontana time line, isolate and save the elevation
          splitLine = line.split(/[>]+/);
          splitLine = splitLine[1].split(/[<]+/);
          tvaTime = splitLine[0];
        }
  
        if (line.substring(1, 6) == "UPSTR") {
          // It's an elevation level line, save the elevation
          splitLine = line.split(/[>]+/);
          splitLine = splitLine[1].split(/[<]+/);
          tvaElev = splitLine[0];
          tvaElev = Number(tvaElev.replace(',', ''));
        }
  
        if (line.substring(1, 4) == "AVG") {
          splitLine = line.split(/[>]+/);
          splitLine = splitLine[1].split(/[<]+/);
  
          tvaOutFlow = Number(splitLine[0].trim().replace(",", ""));
        }
        if (line.substring(1, 5) == "/ROW") {
          if (tvaTime == 'noon') tvaTime = '12 PM';
  
          // format timestamp for database
          let splitTime = tvaTime.split(" ");
          let splitDate = tvaDate.split("/");
          let year = splitDate[2];
          let month = parseInt(splitDate[0]) - 1; //JS counts numbers from 0-11 (ex. 0 = January)
          let day = splitDate[1];
          let hour = splitTime[0];
          if (splitTime[0] === "12" && splitTime[1] === "AM") {
            hour = 0;
          } else if (splitTime[0] !== "12" && splitTime[1] === "PM") {
            hour = parseInt(hour) + 12;
          }
          let timestamp = new Date(year, month, day, hour);
          // Push each line into data object
          data.push({
            time: timestamp,
            flow: tvaOutFlow,
            elev: tvaElev
          });
        }
      });
      callback(null, data.reverse());
    }  else {
      console.log(`Data is bad for ${bodyOfWater} (TVA)`);
      callback(null, body);
    }
    });
  }
  
}