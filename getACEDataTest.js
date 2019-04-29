const lakes = require("./data/lakeData");
let aceLakes = [];

lakes.forEach(lake => {
    if (lake.bodyOfWater == "Cape Fear River (Fayett)") {
        aceLakes.push(lake);
    }
})

function getACEData(a2wURL, bodyOfWater, callback) {
    var request = require("request");
    request(a2wURL, function (error, response, body) {
        if (error) {
            callback(error);
        } else {
            if (typeof body !== 'json') {
                let data = JSON.parse(body);
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
                    // check for stage entries
                    else if ("Stage" in object) {
                        elevEntries = object.Stage;
                    }
                })
                if (elevEntries.length == 0) {
                    console.log(`No elev data for ${bodyOfWater}`);
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
                                elev: elevEntries[i].value
                            });

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
                                    elev: elevEntries[i].value
                                });

                                // match a flow based on hour
                                for (var j = 0; j < flowEntries.length; j++) {
                                    let flowTime = new Date(flowEntries[j].time + "Z");
                                    let flowHour = flowTime.getHours();
                                    // if current date and hour match set the flow
                                    if (currentTime.toDateString() === flowTime.toDateString() && flowHour == currentHour) {
                                        // Find index of specific entry   
                                        objIndex = exportData.findIndex((obj => obj.time == currentTime));
                                        // Update entry's flow property.
                                        exportData[objIndex].flow = flowEntries[j].value;
                                        break;
                                    }
                                }
                            }


                        }

                    }
                    console.log(bodyOfWater + " complete.");
                    callback(null, exportData);
                }
            } else {
                console.log('bad');
            }

        }
    })
}

aceLakes.forEach(lake => {
    getACEData(lake.elevURL, lake.bodyOfWater, function(data) {
        lake.data = data;
    });
})

