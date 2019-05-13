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
            }
            let dukeLakes = JSON.parse(body);
            let today = new Date();

            dukeLakes.reverse().forEach(function (lake) {
                // Check against future dates DUKE likes to send
                if (new Date(lake.Date) <= today) {
                    // Check to make sure data is good
                    if (lake.Average !== "N/A" && typeof parseInt(lake.Average) == 'number') {
                        // if value isn't zero add the SLD
                        if (Number(lake.Average) !== 0) {
                            lake.Average = Number(lake.Average) + seaLevelDelta;
                        }
                        data.push({
                            time: new Date(lake.Date + " " + "6:00"), // format timestamp
                            elev: Number(lake.Average), // add SLD to average
                            flow: "N/A"
                        })
                    }
                }
            })

            callback(null, data);
        });
    }
}