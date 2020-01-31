const request = require("request")
const cheerio = require("cheerio");
const db = require("../../models")();
const update = require('../updateFunctions');
const weather = require("../updateRoutes/getWeatherData");


module.exports = {

  // WEATHERWATER UPDATE FUNCTION
  // ===============================================================================
  // function to get WEATHERWATER data
  getWEATHERWATERData: function (currentLake, callback) {

    let bodyOfWater = currentLake.bodyOfWater;
    let newUrl = currentLake.elevURL;
    let seaLevelDelta = currentLake.seaLevelDelta;
    var data = [];
    var options = {
      url: newUrl,
      type: "html"
    }
    let dataErrorTrue = false;
    request(options, function (error, response, html) {
      if (error) {
        callback(error);
      } else {
        let dataErrorTrue = false;
        try {
          var $ = cheerio.load(html);
        } catch (error) {
          console.error(error);
          dataErrorTrue = true;
        }

        if (!dataErrorTrue) {
          // Found the correct <td> for AEP data
          let foundFlag = 0;

          // With cheerio, find each <td> on the page
          // (i: iterator. element: the current element)
          $('td').each(function (i, element) {
            // var value = $(this).text();
            if (bodyOfWater === "Smith Mountain" || bodyOfWater === "Leesville") {
              var value = $(element).text();

              if (foundFlag == 2) {
                elev = value;
                date = new Date()
                let date1 = date.getMonth() + 1;
                let date2 = "/" + date.getDate() + "/" + new Date().getFullYear();
                date = date1 + date2;
                time = new Date(date + " 13:00");
                flow = "N/A";
                foundFlag++;

                data.push({
                  elev: elev,
                  time: time,
                  flow: "N/A"
                });
              }

              if (foundFlag == 1) foundFlag++
              if (value == bodyOfWater) foundFlag++;


            } else {
              if (i < 1) {
                var value = $(element).children().text();
                date = value.substring(97, 101) + "/" + new Date().getFullYear();
                time = new Date(date + " 13:00");
                elev = value.substring(110, 114);
                flow = "N/A";
                data.push({
                  elev: elev,
                  time: time,
                  flow: "N/A"
                });
              }
            }

          });
          callback(false, data);
        } else {
          callback(true, html);
        }
      }

    })
  }
}