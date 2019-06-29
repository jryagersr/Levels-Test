const request = require("request");
const db = require("../../models")();
const update = require('../updateFunctions');


module.exports = {

    // SJRWMD UPDATE FUNCTION
    // ===============================================================================
    // function to get SJRWMD data
    getSJRWMDData: function (lakeName, newUrl, callback) {
        var data = [];

        var options = {
            url: newUrl
        }
        //console.log("SJRWMD Call", lakeName);
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

                        // set timestamp for db
                        let timestamp = new Date(body.substr(j - 116, 10) + " " + body.substr(j - 97, 8));
                        let elev = Number(body.substr(j - 77, 5));

                        if (elev !== 0) // If elev not 0 (ie, unposted data)
                            data.push({
                                time: timestamp,
                                elev: elev,
                                flow: "N/A"
                            });
                        j--;
                    };

                    callback(false, data);
                } else {
                    console.log(`Data file not accessible ${lakeName}`)
                    callback(true, html)
                }
            } else {
                console.log(`Invalid data returned`)
                callback(true, html)
            }
        });
    }
}