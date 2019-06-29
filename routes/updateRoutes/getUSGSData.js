const db = require("../../models")();
const update = require('../updateFunctions');


module.exports = {

  // USGS GET FUNCTION
  // ===============================================================================
  // function to get USGS data
  getUSGSData: function (usgsURL, bodyOfWater, seaLevelDelta, callback) {
    let displayBatch = [];
    let lakePool = 0;
    let elevationAdjust = 0;
    let dataErrorTrue = false;
    var request = require("request");
    var data = [];

    request(usgsURL, function (error, response, body) {
      if (error) {
        callback(error);
        return;
      }


      // clear displayBatch
      displayBatch = [];

      try {
        data = JSON.parse(body);
      } catch (error) {
        console.error(error);
        dataErrorTrue = true;
      }

      if (!dataErrorTrue) {
        // Check to see if the sensor is returning data
        if (data.value.timeSeries.length > 0) {
          let valuesIndex = 0;
          // Parse the json data return to find the values we want
          let jIncrement = 1;


          // To retrieve Flows from USGS, we get multiple .timevalues and the variable.variableDecription 
          // value will contain "Discharge" 'Gage' for Flow or Elev data. We must determine which timevalues
          let timeSeriesLength = data.value.timeSeries.length;
          let timeSeriesElevIndex = 0; // default value indicates no data
          let timeSeriesFlowIndex = -1;

          for (i = 0; i < timeSeriesLength; i++) {
            if (data.value.timeSeries[i].variable.variableDescription.includes("Discharge"))
              timeSeriesFlowIndex = i;
            else if (data.value.timeSeries[i].variable.variableDescription.includes("Gage height") ||
              data.value.timeSeries[i].variable.variableDescription.includes("water surface")) {
              for (z = 0; z < data.value.timeSeries[i].values.length; z++) {
                // For some reason Mille Lacs has changed from index 0 to index 1 02/10/19 (Lake Outlet, other sensor has failed??? )
                // Bay Springs, Armory and Pool B are Locks with a sensor that provides Headwater (above the lock)
                // and Tailwater (below the lock)
                // data.value.timeSeries[i].values[j].method[0].methodDescription == "Tailwater" or "Headwater"
                // These three have value[1] of "Tailwater"
                if (['Headwater', 'headwater', '[At Lake Outlet]'].includes(data.value.timeSeries[i].values[z].method[0].methodDescription)) {
                  valuesIndex = z;
                }
              }

              timeSeriesElevIndex = i;
            }
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

          if (seaLevelDelta !== 0)
            elevationAdjust = (parseFloat(elevValues[0].value) + Number(seaLevelDelta)).toFixed(2);
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
          if (elevValues.length <= 100) jIncrement = 1; // If we only get 93 data values when we requested 96 hours, then it's hourly
          if (['Hudson', 'Lawtonka', 'Missouri River (STL)'].includes(bodyOfWater)) jIncrement = 2;
          if (!['Atchafalaya River Basin', 'Arkansas River (Pine Bluff)', 'Mississippi River (Knox)'].includes(bodyOfWater)) jIncrement = 4;
          if (['Monroe'].includes(bodyOfWater)) jIncrement = 12;
          for (j = 0; j < elevValues.length; j += jIncrement) {
            let element = elevValues[j];
            let elev = element.value;
            // let splitTimeDate = element.dateTime.split("T");
            // let date = splitTimeDate[0].substring(2, 10).replace('-', ' ');
            // let time = splitTimeDate[1].substring(0, 5);
            let timestamp = element.dateTime;
            let flow = "N/A";
            if (timeSeriesFlowIndex >= 0)
              flow = flowValues[j].value;
            // adjust the elev for lakes with data relative to full pool (not from sealevel))
            if (seaLevelDelta !== 0) {
              elev = (parseFloat(elevValues[j].value) + Number(seaLevelDelta)).toFixed(2);
            }

            // format timestamp
            timestamp = new Date(timestamp);

            displayBatch.push({
              time: timestamp,
              elev: elev,
              flow: flow
            });
          }

        }
        callback(false, displayBatch);
      } else {
        console.log(`Data ( ${body}) is bad for ${bodyOfWater} (USGS)`);
        callback(true, body);
      }
    })
  }
}