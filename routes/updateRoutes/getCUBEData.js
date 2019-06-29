const request = require("request")
const cheerio = require("cheerio");
const db = require("../../models")();
const update = require('../updateFunctions');


module.exports = {

    // CUBE UPDATE FUNCTION
    // ===============================================================================
    // function to get CUBE data
    getCUBEData: function (bodyOfWater, callback) {
      // Define our data template
      var data = [];
      // Make request for cub carolinas site, returns html
      request("http://ww2.cubecarolinas.com/lake/tabs.php", function (error, response, html) {

          // Load the HTML into cheerio and save it to a variable
          // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'

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
              $('tr').each(function (i, element) {
                // var value = $(this).text();
                var value = $(element).children().text();

                // Skip over the first few sections of data to get to the stuff we need
                if (i > 7) {
                  if (bodyOfWater === "High Rock") {
                    // If the current value is high rock
                    if (value.substring(0, 1) === "H") {
                      date = value.substring(9, 19);
                      time = new Date(date + " 6:00");
                      elev = value.substring(19, 25);
                      flow = "N/A";
                      data.push({
                        elev: elev,
                        time: time,
                        flow: "N/A"
                      });
                    }
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
              callback(true, html)
            }
          }
          });
      }

    }