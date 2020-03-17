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
    let localHTML = [];
    var options = {
      url: newUrl,
      type: "html"
    }
    request(options, function (error, response, html) {
      let dataErrorTrue = false;
      if (currentLake.bodyOfWater !== bodyOfWater)
        console.log(bodyOfWater + " noMatch")
      if (error) {
        callback(error);
      } else {
        bodyOfWater = currentLake.bodyOfWater;
        localHTML = html;
        if (bodyOfWater == "Mead") {
          dataErrorTrue = false;
          try {
            var jsonData = JSON.parse(localHTML);
          } catch (error) {
            dataErrorTrue = true;
          }

        } else {

          try {
            var $ = cheerio.load(localHTML);
          } catch (error) {
            dataErrorTrue = true;
          }
        }
      }

      // For some reason bodyOfWater changes from Mead to Jordan 
      // So we use currentLake.bodyOfWater instead of bodyOfWater
      // this seems to occur every time when stepping through in the debugger
      // Not as often when running
      if (!dataErrorTrue) {
        if (currentLake.bodyOfWater !== bodyOfWater)
          console.log(bodyOfWater + " noMatch")
        bodyOfWater = currentLake.bodyOfWater;
        // Found the correct <td> for AEP data
        let foundFlag = 0;
        let levelFound = 0;
        if (bodyOfWater === "Mead") {
          for (i = 0; i < jsonData.Series.length; i++) {
            switch (jsonData.Series[i].SiteName) {

              case "Lake Mead":
                switch (jsonData.Series[i].DataTypeName) {
                  case "reservoir ws elevation, end of period primary reading":
                    time = jsonData.Series[i].Data[jsonData.Series[i].Data.length - 2].t;
                    elev = Number(jsonData.Series[i].Data[jsonData.Series[i].Data.length - 2].v).toFixed(2);
                    break;
                  case "average total release (sum of all average reservoir release methods)":
                    flow = Number(jsonData.Series[i].Data[jsonData.Series[i].Data.length - 2].v).toFixed(2);
                  default:
                }
                default:
            }
          }
          data.push({
            elev: elev,
            time: time,
            flow: flow
          });

        } else {

          // With cheerio, find each <td> on the page
          // (i: iterator. element: the current element)
          if (currentLake.bodyOfWater !== bodyOfWater)
            console.log(bodyOfWater + " noMatch")

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
                if (levelFound > 0) {
                  levelFound++

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
              }
              if (value == "**** All data is provisional and subject to review and modification ****") {
                levelFound++;
              }
            } else if (i < 1) {
              var value = $(element).children().text();
              if (bodyOfWater == "Erie (Sandusky)") {
                date = value.substring(110, 114) + "/" + new Date().getFullYear();
                time = new Date(date + " 13:00");
                elev = value.substring(123, 127);
                flow = "N/A";

              } else {
                date = value.substring(97, 101) + "/" + new Date().getFullYear();
                time = new Date(date + " 13:00");
                let test = value.split("\n")
                elev = test[11].substring(0, test[11].length - 2)
                //elev = value.substring(110, 116);
                flow = "N/A";
              }
              data.push({
                elev: elev,
                time: time,
                flow: "N/A"
              });
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