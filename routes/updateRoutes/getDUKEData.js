const request = require("request");
const db = require("../../models")();
const update = require('../updateFunctions');
const weather = require("../updateRoutes/getWeatherData");


module.exports = {

    // DUKE UPDATE FUNCTION
    // ===============================================================================
    // function to get DUKE data
    getDUKEData: function (currentLake, callback) {
        let bodyOfWater = currentLake.bodyOfWater;
        let newUrl = currentLake.elevURL;
        let seaLevelDelta = currentLake.seaLevelDelta;
        var data = [];
        var options = {
            url: newUrl,
            type: "xml"
        }
        let dataErrorTrue = false;
        request(options, function (error, response, body) {
            if (error) {
                callback(error);
                return;
            }
            try {
                dukeLakes = JSON.parse(body);
            } catch (error) {
                console.error(error);
                dataErrorTrue = true;
            }
            

            if (!dataErrorTrue) {
                let today = new Date();

                dukeLakes.reverse().forEach(function (lake) {
                    // Check against future dates DUKE likes to send
                    if (new Date(lake.Date) <= today) {
                        // Check to make sure data is good
                        // 0 would mean data not posted yet
                        if ((lake.Average !== "N/A" || lake.Average !== "0") && typeof parseInt(lake.Average) == 'number' && Number(lake.Average) !== 0) {
                            data.push({
                                time: new Date(lake.Date + " " + "6:00"), // format timestamp
                                elev: Number(lake.Average) + seaLevelDelta , // add SLD to average
                                flow: "N/A"
                            })
                        }
                    }
                });
                callback(false, data);
            } else {
                console.log(`Data is bad for ${bodyOfWater} (DUKE)`);
                callback(true, body);
            }
        })
    }
}