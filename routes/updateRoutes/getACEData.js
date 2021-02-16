const db = require("../../models")();
//const update = require('../updateFunctions');
//const weather = require("../updateRoutes/getWeatherData");


module.exports = {

  // ACE (A2W) UPDATE FUNCTION
  // ===============================================================================
  // function to get ACE data
  getACEData: function (currentLake, callback) {
    var request = require("request");
    let data = [];
    let thisLake = currentLake;

    request(thisLake.elevURL, function (error, response, body) {
      if (error || body.includes("503 Service Temporarily Unavailable")) {
        callback(true, "ACE 503 Service Temporarily Unavailable");
      } else {
        let dataErrorTrue = false;
        try {
          data = JSON.parse(body);
        } catch (error) {
          console.log(thisLake.bodyOfWater + " json.Parse error");
          dataErrorTrue = true;
        }

        if (!dataErrorTrue) {
          let elevEntries = [];
          let elevTempEntries = [];
          let flowEntries = [];
          let exportData = [];
          let elevData = false;
          let flowData = false;
          let stageData = false;
          // loop through our json data
          data.forEach(object => {
            // check for elevation entries
            if ("Elev" in object) {
              elevTempEntries = object.Elev;
              elevData = true;
            }
            // check for flow entries
            else if ("Outflow" in object) {
              flowEntries = object.Outflow;
              flowData = true;
            }
            // check for stage entries first (if elev exists it will overwrite)
            else if ("Stage" in object && elevEntries.length == 0 && elevData !== true) {
              elevTempEntries = object.Stage;
              stageData = true;
            }
            // check for stage entries first (if elev exists it will overwrite)
            else if ("Tailwater Stage" in object && elevEntries.length == 0 && elevData !== true) {
              tailwaterEntries = object['Tailwater Stage'];
              stageData = true;
            }
          })
          if (elevTempEntries.length == 0) {
            // send empty array to front end
            //console.log(currentLake.bodyOfWater + " No Elev data from ACE")
            callback(true, " No Elev data from ACE");
          } else {

            //Need to check to see if all are on the half hour
            //change to :00 minutes. Burnsville and Sutton and Summerville 
            let onTheHalfHour = true;
            for (i = 0; i < elevTempEntries.length; i++) {
              let entryTime = new Date(elevTempEntries[i].time);
              let entryTimeMinutes = entryTime.getMinutes();
              if (entryTimeMinutes !== 30) {
                onTheHalfHour = false;
              }
            }
            //if all are on the half hour, change to :00 minutes. 
            // Burnsville, Sutton, and Summerville
            if (onTheHalfHour == true) {
              for (i = 0; i < elevTempEntries.length; i++) {
                let entryTime = new Date(elevTempEntries[i].time)
                entryTime.setMinutes(0);
                elevTempEntries[i].time = entryTime.toString();

              }
            }

            //flow entries are reported on the hour 
            //prepare elevEntries array by removing readings not on the hour
            let k = 0
            for (i = 0; i < elevTempEntries.length; i++) {
              let entryTime = new Date(elevTempEntries[i].time);
              let entryTimeMinutes = entryTime.getMinutes();
              if (entryTimeMinutes == 0) {
                elevEntries[k] = elevTempEntries[i];
                k++;
              }
            }
            // reverse arrays
            elevEntries.reverse();
            flowEntries.reverse();
            for (i = 0; i < elevEntries.length; i++) {
              let elevTime = new Date(elevEntries[i].time);
              elev = elevEntries[i].value + currentLake.seaLevelDelta;
              let flowTime = new Date();
              for (j = 0; j < flowEntries.length; j++) {
                if (flowData == true) {
                  flowTime = new Date(flowEntries[j].time);
                  let flow = flowEntries[j].value;
                  if (elevTime.toString() == flowTime.toString()) {
                    //console.log(elev + " " + flow + " " + elevTime);
                    exportData.push({
                      time: elevTime,
                      elev: elev,
                      flow: flow
                    });
                    j = flowEntries.length;
                  }
                  if (j == flowEntries.length - 1) {
                    //console.log(elev + " " + "noflow" + " " + elevTime);
                    exportData.push({
                      time: elevTime,
                      elev: elev,
                      flow: "Missing"
                    });
                  }
                }
              }
              if (flowEntries.length == 0) {
                exportData.push({
                  time: elevTime,
                  elev: elev,
                  flow: "N/A"
                });

              }
            }
            callback(false, exportData);
          }
        } else {
          console.log(currentLake.bodyOfWater + " Error with json.Parse on data from ACE")
          callback(true, " Error with json.Parse on data from ACE");
        }

      }
    })
  }
}