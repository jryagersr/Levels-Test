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
    let flow = -1000
    var data = [];
    let dataErrorTrue = false;
    var options = {
      url: newUrl,
      type: "html"
    }
    request(options, function (error, response, html) {
      if (error) {
        callback(error);
      } else if (bodyOfWater !== "Mead") {
        try {
          var $ = cheerio.load(html);
        } catch (error) {
          console.error(error);
          dataErrorTrue = true;
        }

      } else {
        let dataErrorTrue = false;
        try {
          jsonData = JSON.parse(html);
        } catch (error) {
          console.error(error);
          dataErrorTrue = true;
        }
      }

      if (!dataErrorTrue) {
        // Found the correct <td> for AEP data
        let foundFlag = 0;
        let levelFound = 0;
        if (bodyOfWater === "Mead") {
          time = jsonData.Series[16].Data[0].t
          elev = jsonData.Series[16].Data[0].v;
          flow = Number(jsonData.Series[17].Data[0].v).toFixed(2);

          data.push({
            elev: elev,
            time: time,
            flow: flow
          });

        } else {

          // With cheerio, find each <td> on the page
          // (i: iterator. element: the current element)
          $('td').each(function (i, element) {
            // var value = $(this).text();
            if (bodyOfWater === "Smith Mountain" ||
              bodyOfWater === "Leesville") {
              var value = $(element).text();

              if (foundFlag == 2) {
                elev = value.substr(0, 6);
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


            } else if (bodyOfWater === "Powell" ||
              bodyOfWater === "Elephant Butte" ||
              bodyOfWater === "Flaming Gorge" ||
              bodyOfWater === "Rifle Gap" ||
              bodyOfWater === "Sumner") {
              var value = $(element).text();

              if (levelFound < 7) {
                switch (levelFound) {
                  case 1: {
                    date = value
                    break;
                  }

                  case 2: {
                    elev = value
                    break;
                  }
                  case 5: {
                    flow = value
                    break;
                  }

                  default:

                }
                if (levelFound > 0) levelFound++
              }
              if (flow !== -1000) {
                time = new Date(date + " 13:00");

                data.push({
                  elev: elev,
                  time: time,
                  flow: flow
                });
                flow = -1000
              }
            } else if (value == "**** All data is provisional and subject to review and modification ****") {
              levelFound++;
            } else {
              if (i < 1) {
                var value = $(element).children().text();
                if (bodyOfWater == "Erie (Sandusky)") {
                  date = value.substring(110, 114) + "/" + new Date().getFullYear();
                  time = new Date(date + " 13:00");
                  elev = value.substring(123, 127);
                  flow = "N/A";

                } else {
                  date = value.substring(97, 101) + "/" + new Date().getFullYear();
                  time = new Date(date + " 13:00");
                  elev = value.substring(110, 114);
                  flow = "N/A";
                }
                data.push({
                  elev: elev,
                  time: time,
                  flow: "N/A"
                });
              }
            }
          });
        }
        callback(false, data);
      } else {
        callback(true, html);
      }

    })
  }
}