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
                if (body.substring(129, 24) !== "Data file not accessible") {
                    let j = body.length - 15;
                    j++;
                    // Get the most recent 30 days data
                    for (i = 0; i < 30; i++) {
                        // find next end of row
                        for (j = j - 5; body.substr(j, 5) !== "</tr>" && j > 0; j--) {}

                        // set timeStamp for db
                        let timeStamp = new Date(body.substr(j - 116, 10) + " " + body.substr(j - 97, 8));
                        let elev = Number(body.substr(j - 77, 5));

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
                    callback(true, html)
                }
            } else {
                console.log(`SJRWMD Invalid data returned`)
                callback(true, body)
            }
        });
    }
}