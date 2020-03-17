const request = require("request");
const _ = require("underscore");
const db = require("../../models")();
const update = require('../updateFunctions');
const weather = require("../updateRoutes/getWeatherData");


module.exports = {

    // TWDB UPDATE FUNCTION
    // ===============================================================================
    // function to get TWDB data
    getTWDBData: function (currentLake, callback) {
        let newUrl = currentLake.elevURL;
        let bodyOfWater = currentLake.bodyOfWater;
        var data = [];

        var options = {
            url: newUrl
        }
        request(options, function (error, response, body) {
            if (error) {
                callback(error);
            }
            if (typeof body !== 'undefined') {
                _.each(body.split("\r\n"), function (line) {
                    // Split the text body into readable lines
                    var splitLine;
                    line = line.trim();
                    // Check to see if this is a data line
                    if (!isNaN(line[0])) {
                        splitLine = line.split(/[,]+/); // split the line
                        // Index 0=date, 1=elevation, there is no flow or time

                        // format timestamp for db
                        let timestamp = new Date(splitLine[0] + " 6:00");
                        // Push each line into data object

                        if (splitLine[1] !== 0) // If elev not 0 (ie, unposted data)
                            data.push({
                                time: timestamp,
                                elev: splitLine[1],
                                flow: "N/A"
                            });
                    }
                });
                callback(false, data.reverse()); // reverse the data 
            } else {
                callback(true, body);
            }
        });
    }
}