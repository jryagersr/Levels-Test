const mongoose = require("mongoose");
var express = require("express"),
  app = express(),
  request = require("request"),
  _ = require("underscore"),
  fs = require('fs');

// Holds our display data to send into buildTable function
let displayBatch = [];

// Variable to calculate and display current pool level
let lakePool = 0;
let seaLevelDelta = 0;
let elevationAdjust = 0;

// var txData = [];

// Require all models
var db = require("../models")();

// // Connect to the Mondo DB
// var databaseUri = 'mongodb://localhost/BassSavvyTestDb';

// if (process.env.MONGODB_URI) {
//   db.connect(process.env.MONGODB_URI);
// } else {
//   db.connect(databaseUri);
// }

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  var $ = require("jquery");
  var request = require("request");
  // API GET Requests
  // ---------------------------------------------------------------------------

  // Route to retrieve a single lake's data from db
  // app.get("/api/lakes/:lakeName", function (req, res) {
  //   let lakeName = req.params.lakeName
  //   db.model("Lake").find({ name: lakeName })
  //     .exec(function (err, data) {
  //       if (err) {
  //         res.send(lakeName + " lake data not found");
  //       } else {
  //         res.json(data)
  //       }
  //     })
  // })


  // Route to retrieve lakes in a specific state
  app.get("/api/states/:state", function (req, res) {
    var data = require("../data/lakeData");
    let state = req.query.state;
    var stateObj = data.find(e => e.state === state);
    res.send(stateObj);
  })

  // Route to retrieve lakeData.js
  app.get("/api/lake-data", function (req, res) {
    // Import lake data from lakeData.js
    var data = require("../data/lakeData");
    res.json(data);
  })


  // Route to retrieve data for cube carolinas
  app.get("/api/cube", function (request, response) {
    // Parses our HTML and helps us find elements
    var cheerio = require("cheerio");
    // Makes HTTP request for HTML page
    var request = require("request");

    scrapeCubeData(function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data);
      }
    });

    function scrapeCubeData(callback) {
      // Define our data template
      var data = [{
        lakeName: "High Rock",
        data: []
      }, {
        lakeName: "Badin",
        data: []
      }, {
        lakeName: "Tuckertown",
        data: []
      }];
      // Make request for cub carolinas site, returns html
      request("http://ww2.cubecarolinas.com/lake/tabs.php", function (error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // With cheerio, find each <td> on the page
        // (i: iterator. element: the current element)
        $('tr').each(function (i, element) {
          // var value = $(this).text();
          var value = $(element).children().text();

          // Skip over the first few sections of data to get to the stuff we need
          if (i > 7) {
            // If the current value is high rock
            if (value.substring(0, 1) === "H") {
              date = value.substring(9, 19);
              elev = value.substring(19, 25);
              data[0].data.push({
                date: date,
                elev: elev
              });
            }
            // If the current value is Badin
            if (value.substring(0, 1) === "B") {
              date = value.substring(15, 25);
              elev = value.substring(25, 31);
              data[1].data.push({
                date: date,
                elev: elev
              });
            }
            // If Tuckertown
            if (value.substring(0, 1) === "T") {
              date = value.substring(10, 20);
              elev = value.substring(20, 26);
              data[2].data.push({
                date: date,
                elev: elev
              });
            }
          }
        });
        callback(null, data);
      });
    }
  })

  /***************************************************************************************************************************************** */
  // Route to retrieve USGS Elev data from USGS
  app.get("/api/usgs", function (request, response) {
    let usgsURL = request.query.usgsURL;
    console.log('usgsURL:', usgsURL)
    let currentLake = request.query.currentLake;

    getData(usgsURL, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(displayBatch);
      }
    });

    function getData(usgsURL, callback) {
      var request = require("request");
      var data = [];

      request(usgsURL, function (error, response, body) {
        if (error) {
          callback(error);
        }

        // clear displayBatch
        displayBatch = [];

        data = JSON.parse(body);

        console.log("USGS Call");
        console.log(currentLake.bodyOfWater);
        console.log(data);
        // Check to see if the sensor is returning data
        if (data.value.timeSeries.length > 0) {
          let valuesIndex = 0;
          // Parse the json data return to find the values we want
          let jIncrement = 1;
          if (currentLake.bodyOfWater == "Mille Lacs")
            valuesIndex = 1 // For some reason Mille Lacs has changed from index 0 to index 1 02/10/19

          // To retrieve Flows from USGS, we get multiple .timevalues and the variable.variableDecription 
          // value will contain "Discharge" 'Gage' for Flow or Elev data. We must determine which timevalues
          let timeSeriesLength = data.value.timeSeries.length;
          let timeSeriesElevIndex = -1; // default value indicates no data
          let timeSeriesFlowIndex = -1;

          for (i = 0; i < timeSeriesLength; i++) {
            if (data.value.timeSeries[i].variable.variableDescription.includes("Discharge"))
              timeSeriesFlowIndex = i;
            else if (data.value.timeSeries[i].variable.variableDescription.includes("Gage height") ||
              data.value.timeSeries[i].variable.variableDescription.includes("water surface"))
              timeSeriesElevIndex = i;
          }
          // Set up elev and flow Values
          let elevValues = '';
          let flowValues = '';

          elevValues = data.value.timeSeries[timeSeriesElevIndex].values[valuesIndex].value;
          // Reverse the order of our data so most recent date is first
          elevValues.reverse();

          if (timeSeriesFlowIndex >= 0) { // if there is flow data, then set the flowValues
            flowValues = data.value.timeSeries[timeSeriesFlowIndex].values[valuesIndex].value;
            // Reverse the order of our data so most recent date is first
            flowValues.reverse();
          }

          // If reported level is not based on MSL, set the seaLevelDelta to add to the level
          // to convert to MSL based.
          if (currentLake.seaLevelDelta !== 0)
            elevationAdjust = (parseFloat(elevValues[0].value) + Number(currentLake.seaLevelDelta)).toFixed(2);
          else {
            if (lakePool !== 0)
              elevationAdjust = elevValues[0].value;
            else elevationAdjust = elevValues[0].value;
          }

          // Set current Date, Time and Elev
          currentElev = elevationAdjust;
          let splitTimeDate = elevValues[0].dateTime.split("T");
          currentDate = splitTimeDate[0];
          currentTime = splitTimeDate[1].substring(0, 5);
          currentDelta = (currentElev - lakePool).toFixed(2);

          // Create our increment and loop through each value
          // For each value push an object into displayBatch
          // Set our counter K variable before incrementing for flowUSGS to use
          // k = j;
          if (elevValues.length <= 100) // If we only get 93 data values when we requested 96 hours, then it's hourly
            jIncrement = 1;
          else if (['Hudson', 'Lawtonka'].includes(currentLake.bodyOfWater)) jIncrement = 2;
          else jIncrement = 4;
          for (j = 0; j < elevValues.length; j += jIncrement) {
            let element = elevValues[j];
            let elev = element.value;
            let splitTimeDate = element.dateTime.split("T");
            let date = splitTimeDate[0].substring(2, 10).replace('-', ' ');
            let time = splitTimeDate[1].substring(0, 5);
            let flow = "N/A";
            if (timeSeriesFlowIndex >= 0)
              flow = flowValues[j].value;
            // adjust the elev for lakes with data relative to full pool (not from sealevel))
            if (currentLake.seaLevelDelta !== 0) {
              elev = (parseFloat(elevValues[j].value) + Number(currentLake.seaLevelDelta)).toFixed(2);
            }

            displayBatch.push({
              date: date,
              time: time,
              elev: elev,
              flow: flow
            });
          }

        }
        
        callback(null, displayBatch);

      })

    }

  })

  /***************************************************************************************************************************************** */
  // Route to retrieve ACE data from A2W
  app.get("/api/a2w", function (request, response) {
    let a2wURL = request.query.a2wURL;
    let currentLake = request.query.currentLake;

    getData(a2wURL, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(displayBatch);
      }
    });

    function getData(a2wURL, callback) {
      var request = require("request");
      var data = [];
      request(a2wURL, function (error, response, body) {
        if (error) {
          callback(error);
        };

        data = JSON.parse(body);

        // Insert data processing code from thisLake.js here

        console.log("ACE Call");
        console.log(data);

        let ACEFlow = false;
        let ACEFlowIndex = -1;
        let ACEElevIndex = 0;
        let ACEElevNum = 0;
        let ACEFlowNum = 0;
        let exceptionLake = false;

        // clear displayBatch
        displayBatch = [];

        //see if A2W is returning Elev Data
        if (typeof data[0].Elev !== 'undefined') {

          // default value of ACEFlow is false, indicating ACE has no Flow Data included
          // default value of ACEFlowIndex is -1, indicating
          // Sometimes OutFlow is index 1, sometimes it's index 2, or 3
          // And then there is Ross Barnett, that doesn't have flow and only has 3 in the array!

          // Automating the AceFlowIndex value identification code to automatically determine based on data (Fix the Ace Outflow problem)
          let aa = 0
          while (aa < data.length && typeof data[aa].Outflow == 'undefined') {
            AceFlowIndex = aa;
            aa++;
          }
          if (aa < data.length && aa > 0) {
            ACEFlow = true;
            ACEFlowIndex = aa;
          } else exceptionLake = true;

          let firstDate = data[ACEElevIndex].Elev[0].time.split(" ");
          let secondDate = data[ACEElevIndex].Elev[1].time.split(" ");
          let dailyACEData = firstDate[1] === secondDate[1]; // default value, this is for when ACE only returns daily readings vs hourly
          let isLakeIstokpoga = currentLake.bodyOfWater == 'Istokpoga'; // default value, this is when the ACE data is Fucked Up like Istokpoga in Florida, Damn...

          // These have 120 elev data and 5 Flow, ignore flow data
          if (['Truman', 'Pomme De Terre', "Stockton", "Rend", ].includes(currentLake.bodyOfWater))
            ACEFlow = false;

          // Get current Date, Time and Elev
          // Convert ACE date to javascript Date format "12/24/2016 02:00:00"

          // Indexes into data for the first entry

          if (ACEFlow) { // If there are flows, get the data indexes set up for the for loop below.
            if (Date.parse(data[ACEElevIndex].Elev[ACEElevNum].time) !== Date.parse(data[ACEFlowIndex].Outflow[ACEFlowNum].time)) {
              // Now need to line up the dates

              // The Flow data comes in on the hour, find the first elev data that is on the hour
              let elevOnHour = false;

              while (!elevOnHour) {
                elevMinIndex = data[ACEElevIndex].Elev[ACEElevNum].time.indexOf(":") + 1;
                elevMin = data[ACEElevIndex].Elev[ACEElevNum].time.substr(elevMinIndex, 2)
                if (elevMin == "00")
                  elevOnHour = true;
                else ACEElevNum++
              }

              // Determine if flow date is earlier or later than first elev date
              // Use the later date as a base and loop thru the earlier date until they match
              elevTime = Date.parse(data[ACEElevIndex].Elev[ACEElevNum].time);
              flowTime = Date.parse(data[ACEFlowIndex].Outflow[ACEFlowNum].time);
              if (elevTime > flowTime)
                while (elevTime !== flowTime) {
                  ACEFlowNum++;
                  flowTime == Date.parse(data[ACEFlowIndex].Outflow[ACEFlowNum].time);
                }
              else
                while (flowTime > elevTime) {
                  ACEElevNum++;
                  elevTime = Date.parse(data[ACEElevIndex].Elev[ACEElevNum].time);
                }

            }
          }


          // Convert UTC date to local time
          let localTime = convertStringToUTC(data[ACEElevIndex].Elev[ACEElevNum].time)


          // Create our increment and loop through each value
          // For each value create our associated table html
          let i = ACEFlowNum;
          let flow = 0;
          let lastHourDisplayed = -1; // for Istokpoga
          let displayFlowData = true; // This is for this loop, some lakes we have to sort through the times (Istokpoga, FL)
          let jIncrement = 1; // default

          // if the elev length is more than 3x the flow length, it's probably 
          // elevs every 15 minutes and flows on the hour 4:1 ratio
          if (ACEFlow && (data[ACEElevIndex].Elev.length / 3 > data[ACEFlowIndex].Outflow.length))
            jIncrement = 4;

          // Lower the increment if the elev data is daily
          if (dailyACEData)
            jIncrement = 1;

          if (['Eufaula', 'Brantley', 'Columbus'].includes(currentLake.bodyOfWater)) // Eufaula is every 15 minutes with no OutFlow
            if (currentLake.normalPool < 189) { // This identfies Eufaula AL from Eufaula, OK
              jIncrement = 4;
              exceptionLake = true; // set the exceptionLake flag to bypass the flow check in the for loop below
            }
          if (['Brantley'].includes(currentLake.bodyOfWater)) // Brantley is every 15 minutes with no OutFlow
            jIncrement = 4;

          if (['Red Rock'].includes(currentLake.bodyOfWater)) // Red Rock is every 30 minutes
            jIncrement = 2;

          for (j = ACEElevNum; j < data[ACEElevIndex].Elev.length; j = j + jIncrement) {
            // make sure the times match for elev and flow
            if (!exceptionLake && i < data[ACEFlowIndex].Outflow.length - 1) {
              if (Date.parse(data[ACEElevIndex].Elev[j].time) !== Date.parse(data[ACEFlowIndex].Outflow[i].time)) {
                if (ACEFlow) {
                  // Do the elev and flow dates match
                  while (Date.parse(data[ACEElevIndex].Elev[j].time) !== Date.parse(data[ACEFlowIndex].Outflow[i].time)) {
                    // If not, need to line up the dates

                    //Which one is behind
                    if (Date.parse(data[ACEElevIndex].Elev[j].time) <= Date.parse(data[ACEFlowIndex].Outflow[i].time)) {
                      // The Flow data comes in on the hour, find the next elev data that is on the hour
                      let elevOnHour = false;

                      while (!elevOnHour) { // until we find an on the hour
                        // get the index at the 'minutes'
                        elevMinIndex = data[ACEElevIndex].Elev[j + 1].time.indexOf(":") + 1;
                        // retrieve the 'minutes'
                        elevMin = data[ACEElevIndex].Elev[j + 1].time.substr(elevMinIndex, 2)
                        if (elevMin == "00") { // is it on the hour
                          elevOnHour = true; // end while loop
                          j++
                        } else j++ // increment and loop
                      }
                    } else i++
                  }
                }
              }
            }

            let elev = data[ACEElevIndex].Elev[j].value.toFixed(2);
            localTime = convertStringToUTC(data[ACEElevIndex].Elev[j].time);
            let date = localTime.toString().substring(4, 15);
            let time = localTime.toString().substring(16, 21);
            flow = 'No data'; // default value, this differentiates no reported data from no data available (N/A)
            if (ACEFlow)
              if (i < data[ACEFlowIndex].Outflow.length) {

                if (data[ACEFlowIndex].Outflow[i].value !== -99)
                  flow = data[ACEFlowIndex].Outflow[i].value // commented out for production + " " + convertStringToUTC(data[ACEFlowIndex].Outflow[i].time);

              } else flow = 'Missing'; // This differentiate this condition vs N/A or No data

            /*
            if (isLakeIstokpoga == true && localTime.getHours() == lastHourDisplayed) {
                displayFlowData = false;
            } else {
                lastHourDisplayed = localTime.getHours();
                displayFlowData = true;
            }*/

            if (displayFlowData) {
              if (ACEFlow) {
                displayBatch.push({
                  date: date,
                  time: time,
                  elev: elev,
                  flow: flow
                })
              } else {
                displayBatch.push({
                  date: date,
                  time: time,
                  elev: elev,
                  flow: "N/A" // no data available
                });
              }
            }

            i++;

          }
          // Convert UTC date to local time
          /*localTime = convertStringToUTC(data[ACEElevIndex].Elev[j - jIncrement].time)
          currentDate = localTime.toString().substring(4, 15);
          currentTime = localTime.toString().substring(16, 21);

          currentElev = parseFloat(data[ACEElevIndex].Elev[j - jIncrement].value).toFixed(2);

          currentDelta = (currentElev - lakePool).toFixed(2);*/

        } 

        // End of data processing code from thisLake.js

        callback(null, displayBatch.reverse());
      })
    }
    // Date Conversion functions from thisLake.js


    function getMonthNumberFromString(mon) {

      var d = Date.parse(mon + "1, 2012");
      if (!isNaN(d)) {
        return new Date(d).getMonth() + 1;
      }
      return -1;
    }

    function convertStringToUTC(convertedTime) {
      // Convert UTC date to local time
      // Convert to ISO format first. '2011-04-11T10:20:30Z'
      convertedTime = convertedTime.trim();
      let convertedMonth = convertedTime.substring(3, 6);
      convertedMonth = getMonthFromString(convertedMonth);
      convertedMonth = convertedMonth.toString();
      if (convertedMonth.length == 1) convertedMonth = "0" + convertedMonth;
      //Convert the string to UTC (GTM)
      convertedTime = convertedTime.substring(7, 11) + "-" + convertedMonth + "-" + convertedTime.substring(0, 2) + "T" + convertedTime.substring(12, 21) + "Z";
      //Convert the string to a Date
      //convertedTime = new Date(convertedTime);
      //Might need this call in ater
      convertedTime = new Date(convertedTime);
      //Convert the Date to local time (client)
      // convertedTime = convertedTime.toString(convertedTime);
      // Time now looks like "Thu Dec 27 2018 11:15:00 GMT-0500 (Eastern Standard Time)"
      // Substring the pieces we want to display
      return (convertedTime)
    }

    function getMonthFromString(mon) {
      return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
    }

    function convertUTCDate(timestamp) {
      // Multiply by 1000 because JS works in milliseconds instead of the UNIX seconds
      var date = new Date(timestamp * 1000);

      var year = date.getUTCFullYear();
      var month = date.getUTCMonth() + 1; // getMonth() is zero-indexed, so we'll increment to get the correct month number
      var day = date.getUTCDate();
      var hours = date.getUTCHours();
      var minutes = date.getUTCMinutes();
      var seconds = date.getUTCSeconds();

      month = (month < 10) ? '0' + month : month;
      day = (day < 10) ? '0' + day : day;
      hours = (hours < 10) ? '0' + hours : hours;
      minutes = (minutes < 10) ? '0' + minutes : minutes;
      seconds = (seconds < 10) ? '0' + seconds : seconds;

      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
    }


    // End of Date Conversion function from thisLake.js

  }); // End of Route to retrieve ACE data from A2W


  /***************************************************************************************************************************************** */
  // Route to retrieve TVA data
  app.get("/api/tva", function (request, response) {
    let tvaURL = request.query.tvaDataURL;
    let tvaLakeName = request.query.tvaLakeName;

    getData(tvaLakeName, tvaURL, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data.reverse());
      }
    });

    // Function to pull data
    function getData(lakeName, newUrl, callback) {
      var request = require("request");
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
        let tvaOutFlowStart = 0

        _.each(body.split("\r\n"), function (line) {
          // Split the text body into readable lines
          var splitLine;
          line = line.trim();
          splitLine = line.split(/[ ]+/);

          // Check to see if this is a data line by checking for keywords
          if (line.substring(1, 6) == "LOCAL") {
            // It's a date time line, save the date and time
            // Formulate the date 
            tvaDate = splitLine[0].substr(15, 9);
            // Formulate the time
            tvaTime = splitLine[1] + " " + splitLine[2] + " " + splitLine[3].substr(0, 3);
          }

          if (line.substring(1, 6) == "UPSTR") {
            // It's an elevation level line, save the elevation
            tvaElev = line.substring(18, 24)
          }

          if (line.substring(1, 4) == "AVG") {
            // Last Data item
            // Set the outFlowStart to 25 (5 char outFlow
            tvaOutFlowStart = 25;
            if (line.substring(24, 25) != " " && line.substring(23, 24) != " ")
              tvaOutFlowStart = 23;
            else if (line.substring(24, 25) != " ")
              tvaOutFlowStart = 24;
            tvaOutFlow = line.substring(tvaOutFlowStart, 30)
            // Push each line into data object
            data.push({
              lakeName: lakeName,
              date: tvaDate,
              time: tvaTime,
              outflow: tvaOutFlow,
              level: tvaElev
            });
          }
        });
        callback(null, data);
      });
    }
  });

  /***************************************************************************************************************************************** */
  app.get("/api/alabama", function (request, response) {
    var lakeRoute = request.query.lakeRoute;
    // Parses our HTML and helps us find elements
    var cheerio = require("cheerio");
    // Makes HTTP request for HTML page
    var request = require("request");

    scrapeAlabData(lakeRoute, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data);
      }
    });

    function scrapeAlabData(lakeRoute, callback) {
      // Set the base of the request depending on which lake we want
      var url = "";
      switch (lakeRoute) {
        case "columbus":
          url = "http://columbus.lakesonline.com/Level/Calendar"
          break;
        case "smith":
          url = "http://www.smithlake.info/Level/Calendar"
          break;

        case "neelyhenry":
          url = "http://www.neelyhenry.uslakes.info/Level/Calendar"
          break;

        case "loganmartin":
          url = "http://www.loganmartin.info/Level/Calendar"
          break;

        case "lay":
          url = "http://www.laylake.info/Level/Calendar"
          break;

        case "weiss":
          url = "http://www.lakeweiss.info/Level/Calendar"
          break;

        case "gaston":
          url = "http://gaston.uslakes.info/Level/Calendar"
          break;

        case "smithmountain":
          url = "http://smithmountain.uslakes.info/Level/Calendar"
          break;

      }

      // Get today's date to build request url
      var today = new Date();
      var mm = ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1); //Fancy conversion because .getMonth() will return numbers 0-12, but we need two digits months to build url
      var yyyy = today.getFullYear();
      var date = "/" + yyyy + "/" + mm;

      // Define and build previous month's date for second scrape
      var yyyy2 = "";
      var mm2 = "";
      if (mm === "01") {
        mm2 = "12"
        yyyy2 = today.getFullYear() - 1;
        date2 = "/" + yyyy2 + "/" + mm2;
      } else {
        yyyy2 = today.getFullYear();
        var mm2 = (((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) - 1); // Same fancy conversion except -1 added on the end to get previous month
        var date2 = "/" + yyyy2 + "/" + mm2;
      }

      // Define our data template
      var data = []

      // Make request for previous months lakelevels.info site, returns html
      request(url + date2, function (error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        var $ = cheerio.load(html);
        // Simple day increment counter to build date later
        var dd = 1;
        // With cheerio, find each <td> on the page
        // (i: iterator. element: the current element)
        $("font").each(function (i, element) {
          var value = $(element).text();
          if (!isNaN(value) && value.length === 5) {
            data.unshift({
              date: dd + "/" + mm2 + "/" + yyyy2,
              time: "6:00",
              elev: value,
              flow: "N/A"
            });
            dd++;
          }
        })

        // Make second request for current month's lakelevels.info site
        request(url + date, function (error, response, html) {

          // Load the HTML into cheerio and save it to a variable
          var $ = cheerio.load(html);
          // Simple day increment counter to build date later
          var dd = 1;
          // With cheerio, find each <td> on the page
          // (i: iterator. element: the current element)
          $("font").each(function (i, element) {
            var value = $(element).text();
            if (!isNaN(value) && value.length === 5) {
              data.unshift({
                date: dd + "/" + mm + "/" + yyyy,
                time: "06:00",
                elev: value,
                flow: "N/A"
              });
              dd++;
            }
          })
          callback(null, data);
        });
      });
    }
  })




  // API POST Requests
  // ---------------------------------------------------------------------------

  // Route to update database with new lake data
  // app.post("/api/usgs", (req, res) => {
  //   console.log("nameID: " + req.body.nameID)
  //   req.body.newBatch.forEach(function (e) {
  //     db.model('Lake').updateOne({
  //       _id: ObjectId(req.body.nameID),
  //       data: [{
  //         level: e.value,
  //         date: e.date,
  //         time: e.time
  //       }]
  //     })
  //       .then(function (data) {
  //         res.json(data);
  //       })
  //       .catch(function (err) {
  //         res.json(err);
  //       });
  //   })
  // });


  /***************************************************************************************************************************************** */
  //Start of dukeData
  // Route to retrieve DUKE data
  app.get("/api/duke", function (request, response) {
    let dukeURL = request.query.dukeDataURL;
    let dukeLakeName = request.query.dukeLakeName;

    getData(dukeLakeName, dukeURL, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data.reverse());
      }
    });

    // Function to pull data
    function getData(lakeName, newUrl, callback) {
      var request = require("request");
      var data = [];
      var options = {
        url: newUrl,
        type: "xml"
      }
      request(options, function (error, response, body) {
        if (error) {
          callback(error);
        }
        let dukeLakes = JSON.parse(body);

        callback(null, dukeLakes);
      });
    }
  });

  //End of dukeData

  /***************************************************************************************************************************************** */

  // Route to retrieveSJRWMD data
  app.get("/api/sjrwmd", function (request, response) {
    let sjrwmdURL = request.query.sjrwmdDataURL;
    let sjrwmdLakeName = request.query.sjrwmdLakeName;

    getData(sjrwmdLakeName, sjrwmdURL, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data);
      }
    });

    // Function to pull data
    function getData(lakeName, newUrl, callback) {
      var request = require("request");
      var data = [];

      var options = {
        url: newUrl
      }
      request(options, function (error, response, body) {
        if (error) {
          callback(error);
        }
        let j = body.length - 15;
        j++;
        // Get the most recent 30 days data
        for (i = 0; i < 30; i++) {
          // find next end of row
          for (j = j - 5; body.substr(j, 5) !== "</tr>"; j--) {}

          data.push({
            lakeName: lakeName,
            date: body.substr(j - 116, 10),
            time: body.substr(j - 97, 8),
            inflow: "N/A",
            outflow: "N/A",
            level: body.substr(j - 77, 5),
          });
          j--;
        };

        callback(null, data);
      });
    }


  });

  /***************************************************************************************************************************************** */

  // Route to retrieve TWDB data
  app.get("/api/twdb", function (request, response) {
    let twdbURL = request.query.twdbDataURL;
    let twdbLakeName = request.query.twdbLakeName;

    getData(twdbLakeName, twdbURL, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data);
      }
    });

    // Function to pull data
    function getData(lakeName, newUrl, callback) {
      var request = require("request");
      var data = [];

      var options = {
        url: newUrl
      }
      request(options, function (error, response, body) {
        if (error) {
          callback(error);
        }
        _.each(body.split("\r\n"), function (line) {
          // Split the text body into readable lines
          var splitLine;
          line = line.trim();
          // Check to see if this is a data line
          if (!isNaN(line[0])) {
            splitLine = line.split(/[,]+/); // split the line
            // Index 0=date, 1=elevation, there is no flow or time

            // Push each line into data object
            data.push({
              lakeName: lakeName,
              date: splitLine[0],
              time: "06:00",
              inflow: "N/A",
              outflow: "N/A",
              level: splitLine[1]
            });
          }
        });
        callback(null, data.reverse()); // reverse the data 
      });
    }


  });

  /***************************************************************************************************************************************** */
  // This reads the tournament file for the Tournaments Page
  app.get("/api/tournaments", function (request, response) {
    // Import our txData from tournamentData.js file
    var txData = require("../data/tournamentData");

    response.json(txData);


  });


  // Fetch weather data
  // app.get("/api/weather", function (req, res) {
  //   getData(function (error, data) {
  //     if (error) {
  //       res.send(error);
  //       return;
  //     } else {
  //       res.json(data);
  //     }
  //   });

  //   function getData(callback) {
  //     var request = require("request");
  //     var datasets = "https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets";
  //     var datasetid = "PRES";
  //     var url = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=" + datasetid + "&locationid=ZIP:27502&startdate=2019-01-06&enddate=2019-02-06";

  //     let key = "vJcdHzCyQMDapjrtVTDTExkrTVUEIkNq";
  //     var options = {
  //       url: datasets,
  //       method: "GET",
  //       headers: {
  //         token: key
  //       }
  //     }
  //     request(options, function (error, response, body) {
  //       var data = JSON.parse(body);
  //       callback(null, data);
  //     });
  //   }
  // });

}; // End of module.exports