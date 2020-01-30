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

          // With cheerio, find each <td> on the page
          // (i: iterator. element: the current element)
          $('td').each(function (i, element) {
            // var value = $(this).text();
            var value = $(element).children().text();
            if (i < 1) {
              if (bodyOfWater === "Gaston") {
                // If the current value is Gaston

                date = value.substring(97, 101) + "/" + new Date().getFullYear();
                time = new Date(date + " 13:00");
                elev = value.substring(110, 116);
                flow = "N/A";
                data.push({
                  elev: elev,
                  time: time,
                  flow: "N/A"
                });

              } else if (bodyOfWater === "Badin") {
                // If the current value is Badin
                if (value.substring(0, 1) === "B") {
                  date = value.substring(15, 25);
                  time = new Date(date + " 6:00");
                  elev = value.substring(25, 31);
                  flow = "N/A"
                  data.push({
                    elev: elev,
                    time: time,
                    flow: "N/A"
                  });
                }
              } else if (bodyOfWater === "Tuckertown") {
                // If Tuckertown
                if (value.substring(0, 1) === "T") {
                  date = value.substring(10, 20);
                  time = new Date(date + " 6:00");
                  elev = value.substring(20, 26);
                  flow = "N/A"
                  if (elev !== 0) // If elev not 0 (ie, unposted data)
                    data.push({
                      elev: elev,
                      time: time,
                      flow: "N/A"
                    });
                }
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