const db = require("../../models")();
const update = require('../updateFunctions');


module.exports = {

  // ACE (A2W) UPDATE FUNCTION
  // ===============================================================================
  // function to get ACE data
  getACEData: function (a2wURL, bodyOfWater, normalPool, elevInterval, callback) {
    var request = require("request");
    var data = [];
    request(a2wURL, function (error, response, body) {
      if (error) {
        callback(error);
      } else {
        let dataErrorTrue = false;
        try {
          data = JSON.parse(body);
        } catch (error) {
          console.error(error);
          dataErrorTrue = true;
        }

        if (!dataErrorTrue) {
          // let data = JSON.parse(body);
          let elevEntries = [];
          let flowEntries = [];
          let exportData = [];
          // loop through our json data
          data.forEach(object => {
            // check for elevation entries
            if ("Elev" in object) {
              elevEntries = object.Elev;
            }
            // check for flow entries
            else if ("Outflow" in object) {
              flowEntries = object.Outflow;
            }
            // check for stage entries first (if elev exists it will overwrite)
            else if ("Stage" in object && elevEntries.length == 0) {
              elevEntries = object.Stage;
            }
          })
          if (elevEntries.length == 0) {
            console.log(`No elev data for ${bodyOfWater} (ACE)`);
            // send empty array to front end
          } else {
            // reverse arrays
            elevEntries.reverse();
            flowEntries.reverse();

            for (var i = 0; i < elevEntries.length; i++) {

              // push the first entry into the array
              if (i == 0 && elevEntries[i].value !== "") {
                let currentTime = new Date(elevEntries[i].time + "Z");
                currentTime.setMinutes(0);
                exportData.push({
                  time: currentTime,
                  elev: elevEntries[i].value,
                  flow: "N/A"
                });

                if (flowEntries.length > 0) {
                  //match first flow
                  for (var j = 0; j < flowEntries.length; j++) {
                    let flowTime = new Date(flowEntries[j].time + "Z");
                    let flowHour = flowTime.getHours();
                    let currentHour = currentTime.getHours();
                    // if current date and hour match set the flow
                    if (currentTime.toDateString() === flowTime.toDateString() && flowHour == currentHour) {
                      exportData[i].flow = flowEntries[j].value;
                      break;
                    }
                  }
                  if (typeof exportData[0].flow == 'undefined' || exportData[0].flow == 'N/A') {
                    exportData[0].flow = "Missing";
                  }
                }
              }

              // if previous entry isn't undefined (we're on entry 2 or later)
              else {
                // check next entry's hour against previous and if different push in
                let lastTime = new Date(elevEntries[i - 1].time + "Z");
                let lastHour = lastTime.getHours();
                let currentTime = new Date(elevEntries[i].time + "Z");
                let currentHour = currentTime.getHours();
                if (lastHour !== currentHour) {
                  currentTime.setMinutes(0);
                  exportData.push({
                    time: currentTime,
                    elev: elevEntries[i].value,
                    flow: "N/A"
                  });

                  // if flows exist
                  if (flowEntries.length > 0) {
                    // match a flow based on hour
                    for (var j = 0; j < flowEntries.length; j++) {
                      let flowTime = new Date(flowEntries[j].time + "Z");
                      let flowHour = flowTime.getHours();
                      let objIndex;
                      // if current date and hour match set the flow
                      if (currentTime.toDateString() === flowTime.toDateString() && flowHour == currentHour) {
                        // Find index of specific entry   
                        objIndex = exportData.findIndex((obj => obj.time == currentTime));
                        // Update entry's flow property.
                        exportData[objIndex].flow = flowEntries[j].value;
                        break;
                      } else {
                        objIndex = exportData.findIndex((obj => obj.time == currentTime));
                        exportData[objIndex].flow = "Missing";
                      }
                    }
                  }
                }


              }

            }
            callback(null, exportData);
          }
        } else {
          console.log(`Data is bad for ${bodyOfWater} (ACE)`);
          callback(null, body);
        }

      }
    })
  }

}