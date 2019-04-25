const db = require("../../models")();
const update = require('../updateFunctions');


module.exports = {

// ACE (A2W) UPDATE FUNCTION
// ===============================================================================
// function to get ACE data
getACEData: function (a2wURL, bodyOfWater, normalPool, elevDataInterval, callback) {
    var request = require("request");
    var data = [];
    request(a2wURL, function (error, response, body) {
      if (error) {
        callback(error);
      };
  
      // Check to see if data returned is undefined
      if (body == undefined) {
        data = [];
        callback(null, data);
        // if not undefined proceed with function
      } else {
        // if statement added for bug
        // add this in later: 
        // /<[a-z][\s\S]*>/i.test() 
        //This is Regex to check if a string contains html elements
        if (body.includes("503 Service Temporarily Unavailable")) {
          data = [];
          callback(null, data);
        } else {
  
  
  
          data = JSON.parse(body);
  
          // Insert data processing code from thisLake.js here
  
          let ACEFlow = false;
          let ACEFlowIndex = -1;
          let ACEElevIndex = 0;
          let ACEElevNum = 0;
          let ACEFlowNum = 0;
          let exceptionLake = false;
          let stageRiver = [];
          let elevMin = "";
  
          if (typeof data[0].Elev == 'undefined' &&
            typeof data[0].Stage !== 'undefined' && bodyOfWater.indexOf("River") >= 0) {
  
            stageRiver = data; //Copy the data
            data = []; //Clear the data objects
            data.push({
              Elev: stageRiver[0].Stage
  
            })
          }
  
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
            let isLakeIstokpoga = bodyOfWater == 'Istokpoga'; // default value, this is when the ACE data is Fucked Up like Istokpoga in Florida, Damn...
  
            // These have 120 elev data and 5 Flow, ignore flow data
            if (['Truman', 'Pomme De Terre', "Stockton", "Rend", ].includes(bodyOfWater))
              ACEFlow = false;
  
            // Get current Date, Time and Elev
            // Convert ACE date to javascript Date format "12/24/2016 02:00:00"
  
            // Indexes into data for the first entry
  
            if (ACEFlow) { // If there are flows, get the data indexes set up for the for loop below.
              if (Date.parse(data[ACEElevIndex].Elev[ACEElevNum].time) !== Date.parse(data[ACEFlowIndex].Outflow[ACEFlowNum].time)) {
                // Now need to line up the dates
  
                // The Flow data comes in on the hour, find the first elev data that is on the hour
                let elevOnHour = false;
  
                // Deer Creek Utah only returns elevs on the :30 and Flows on the :00 so do not try to line them up.
  
                while (!elevOnHour && bodyOfWater !== "Deer Creek") {
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
            // let localTime = convertStringToUTC(data[ACEElevIndex].Elev[ACEElevNum].time)
  
            // Create our increment and loop through each value
            // For each value create our associated table html
            let i = ACEFlowNum;
            let flow = 0;
            let lastHourDisplayed = -1; // for Istokpoga
            let displayFlowData = true; // This is for this loop, some lakes we have to sort through the times (Istokpoga, FL)
            let jIncrement = 1; // default to 1 hour between elevation data
  
            if (typeof elevDataInterval !== 'undefined')
              // Currently only for Jordan, when Flow Data is missing. This uses data in lakeData.js (elevDataInterval)
              // to set the jIncrement to 4 when there is no Flow Data. This stops Jordan elev data from being displayed
              // every 15 minutes instead of on the hour. Others may require this in the future (ie Kerr).
              jIncrement = Number(elevDataInterval);
  
            // if the elev length is more than 3x the flow length, it's probably 
            // elevs every 15 minutes and flows on the hour 4:1 ratio
            if (ACEFlow && (data[ACEElevIndex].Elev.length / 3 > data[ACEFlowIndex].Outflow.length))
              jIncrement = 4; // Set to 15 minutes between elevation data
  
            // Lower the increment if the elev data is daily
            if (dailyACEData)
              jIncrement = 1;
  
            if (['Eufaula', 'Brantley', 'Columbus'].includes(bodyOfWater)) // Eufaula is every 15 minutes with no OutFlow
              if (normalPool < 189) { // This identfies Eufaula AL from Eufaula, OK
                jIncrement = 4;
                exceptionLake = true; // set the exceptionLake flag to bypass the flow check in the for loop below
              }
            if (['Brantley'].includes(bodyOfWater)) // Brantley is every 15 minutes with no OutFlow
              jIncrement = 4;
  
            if (['Red Rock'].includes(bodyOfWater)) // Red Rock is every 30 minutes
              jIncrement = 2;
  
            for (j = ACEElevNum; j < data[ACEElevIndex].Elev.length; j = j + jIncrement) {
              // make sure the times match for elev and flow
              if (!exceptionLake && i < data[ACEFlowIndex].Outflow.length - 1) {
                if (Date.parse(data[ACEElevIndex].Elev[j].time) !== Date.parse(data[ACEFlowIndex].Outflow[i].time)) {
                  if (ACEFlow) {
                    // Do the elev and flow dates match
  
                    // Deer Creek Utah only returns elevs on the :30 and Flows on the :00 so do not try to line them up.
                    while (Date.parse(data[ACEElevIndex].Elev[j].time) !== Date.parse(data[ACEFlowIndex].Outflow[i].time) &&
                      bodyOfWater !== "Deer Creek") {
                      // If not, need to line up the dates
  
                      //Which one is behind
                      if (Date.parse(data[ACEElevIndex].Elev[j].time) <= Date.parse(data[ACEFlowIndex].Outflow[i].time)) {
                        // Missing Inflow data, push the current elevation and timestamp with N/A as Flow
  
                        displayBatch.push({
                          time: convertStringToUTC(data[ACEElevIndex].Elev[j].time),
                          elev: data[ACEElevIndex].Elev[j].value.toFixed(2),
                          flow: "N/A"
                        });
  
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
                      } else i++;
  
                    }
                  }
                }
              }
  
              let elev = data[ACEElevIndex].Elev[j].value.toFixed(2);
              let timestamp = convertStringToUTC(data[ACEElevIndex].Elev[j].time);
              flow = 'No data'; // default value, this differentiates no reported data from no data available (N/A)
              if (ACEFlow)
                if (i < data[ACEFlowIndex].Outflow.length) {
  
                  if (data[ACEFlowIndex].Outflow[i].value !== -99)
                    flow = data[ACEFlowIndex].Outflow[i].value // commented out for production + " " + convertStringToUTC(data[ACEFlowIndex].Outflow[i].time);
  
                } else flow = 'Missing'; // This differentiate this condition vs N/A or No data
  
  
              let splitLine = data[ACEElevIndex].Elev[j].time.split(/[ ]+/);
              splitLine = splitLine[1].split(/[:]+/);
  
              if (isLakeIstokpoga == true && splitLine[0] == lastHourDisplayed) {
                displayFlowData = false;
              } else {
                lastHourDisplayed = splitLine[0];
                displayFlowData = true;
              }
  
              if (displayFlowData) {
                if (!ACEFlow) flow = "N/A" // no data available
                displayBatch.push({
                  time: timestamp,
                  elev: elev,
                  flow: flow
                });
  
              }
  
              i++;
  
            }
  
          }
  
          // End of data processing code from thisLake.js
  
          callback(null, displayBatch.reverse());
        }
      }
    })
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
  }

}