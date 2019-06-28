const request = require("request");
const db = require("../../models")();
const update = require('../updateFunctions');


module.exports = {

    // DUKE UPDATE FUNCTION
    // ===============================================================================
    // function to get DUKE data
    getDUKEData: function (lakeName, newUrl, seaLevelDelta, callback) {
        var data = [];
        var options = {
            url: newUrl,
            type: "xml"
        }
        request(options, function (error, response, body) {
            if (error) {
                callback(error);
                return;
            }
            let dataErrorTrue = false;
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
                        if (lake.Average !== "N/A" && typeof parseInt(lake.Average) == 'number' && Number(lake.Average) !== 0) {
                            data.push({
                                time: new Date(lake.Date + " " + "6:00"), // format timestamp
                                elev: Number(lake.Average) + seaLevelDelta, // add SLD to average
                                flow: "N/A"
                            })
                        }
                    } 
                });
                callback(null, data);
            }
            else {
                console.log(`Data is bad for ${lakeName} (DUKE)`);
                callback(null, body);
            }
        })
    }
}