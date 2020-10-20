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
      if (typeof html == 'undefined') {
        console.log(`WeatherWater data returned for ${currentLake.bodyOfWater} request call is undefined`);
        dataErrorTrue = true;
      }
      if (currentLake.bodyOfWater !== bodyOfWater)
        console.log(` ${bodyOfWater}  and currentLake.bodyOfWater do not match`)
      if (error) {
        callback(error);
      } else {
        bodyOfWater = currentLake.bodyOfWater;
        localHTML = html;
        if (bodyOfWater == "Mead") {
          //dataErrorTrue = false;
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
          console.log(`${bodyOfWater} does not match ${currentLake.bodyOfWater}`)
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
                    for (j = jsonData.Series[i].Data.length - 2; j >= 0; j--) {

                      time = jsonData.Series[i].Data[j].t; // format timestamp for database
                      let splitTime = time.split(" ");
                      let splitDate = jsonData.Series[i].Data[j].t.split(" ");
                      splitHour = splitDate[1].split(":"); //split the time
                      let hour = splitHour[0]; // get the hour
                      splitDate = splitDate[0].split("/");
                      let year = splitDate[2];
                      let month = parseInt(splitDate[0]) - 1; //JS counts numbers from 0-11 (ex. 0 = January)
                      let day = splitDate[1];

                      if (splitTime[0] === "Midnight") {
                        hour = 0;
                      } else if (splitTime[0] == "Noon") {
                        hour = 12;
                      } else if (splitTime[2] === "PM")
                        hour = parseInt(hour) + 12;

                      time = new Date(year, month, day, hour);
                      elev = Number(jsonData.Series[i].Data[jsonData.Series[i].Data.length - 2].v).toFixed(2);
                      data.push({
                        elev: elev,
                        time: time,
                        flow: flow
                      });
                    }
                    break;
                  case "average total release (sum of all average reservoir release methods)":
                    flow = Number(jsonData.Series[i].Data[jsonData.Series[i].Data.length - 2].v).toFixed(2);
                  default:
                }
                default:
            }
          }

        } else {

          // With cheerio, find each <td> on the page
          // (i: iterator. element: the current element)
          if (currentLake.bodyOfWater !== bodyOfWater)
            console.log(bodyOfWater + " noMatch")

          if (typeof $ !== 'undefined') {
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
                  // loop through the data and push it on the list.
                  // first data is at [10], Save the minutes of the time to find the next 1hr interval
                  let splitData = value.split("\n");
                  let minutes = splitData[9].slice(-2);

                  for (k = 9; k < splitData.length; k = k + 4) {
                    if (minutes == splitData[k].slice(-2)) {

                      time = splitData[k].slice(0, 5) + "/" + new Date().getFullYear() + " " + splitData[k].slice(6);
                      time = new Date(time);
                      elev = splitData[k + 1].substring(0, splitData[k + 1].length - 2);
                      flow = "N/A";
                      data.push({
                        elev: elev,
                        time: time,
                        flow: "N/A"
                      });
                    };
                  }

                } else {
                  // loop through the data and push it on the list.
                  // first data is at [10], Save the minutes of the time to find the next 1hr interval
                  let splitData = value.split("\n");
                  let minutes = splitData[10].slice(-2);

                  for (k = 10; k < splitData.length; k = k + 5) {
                    if (minutes == splitData[k].slice(-2)) {

                      time = splitData[k].slice(0, 5) + "/" + new Date().getFullYear() + " " + splitData[k].slice(6);
                      time = new Date(time);
                      elev = splitData[k + 1].substring(0, splitData[k + 1].length - 2);
                      flow = "N/A";
                      data.push({
                        elev: elev,
                        time: time,
                        flow: "N/A"
                      });
                    };
                  }
                }
              }
            });
          } else
            console.log(currentLake.bodyOfWater + " WeatherWater dataErrorTrue Error")
        }
        callback(false, data);
      } else {
        console.log(currentLake.bodyOfWater + " WeatherWater json.Parse Error")
        callback(true, html);
      }

    })
  }
}