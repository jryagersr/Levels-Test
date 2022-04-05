const request = require("request");
const db = require("../../models")();
const update = require('../updateFunctions');
const weather = require("../updateRoutes/getWeatherData");


module.exports = {

    // SJRWMD UPDATE FUNCTION
    // ===============================================================================
    // function to get SJRWMD data
    getSJRWMDData: function (currentLake, callback) {
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
            if (typeof body == 'string') {
                if (body.substring(101, 125) !== "Data File not accessible") {
                    let j = body.length - 39;
                    j++;
                    // Get the most recent 30 days data
                    for (i = 0; i < 30; i++) {
                        // find next end of row
                        for (j = j - 5; body.substring(j, j + 5) !== "</tr>" && j > 0; j--) {}

                        // set timeStamp for db
                        let timeStamp = new Date(body.substring(j-116, j-106) + " " + body.substring(j-97, j-89));
                        let elev = Number(body.substring(j-80, j-72));

                        if (elev !== 0) // If elev not 0 (ie, unposted data)
                            data.push({
                                time: timeStamp,
                                elev: elev,
                                flow: "N/A"
                            });
                        j--;
                    };

                    callback(false, data);
                } else {
                    console.log(`Data file not accessible ${bodyOfWater}`)
                    callback(true, body)
                }
            } else {
                console.log(`SJRWMD Invalid data returned`)
                callback(true, body)
            }
        });
    }
}