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
        request(options, function (error, response, body) {
            if (error) {
                callback(error);
            }
            let j = body.length - 15;
            j++;
            // Get the most recent 30 days data
            for (i = 0; i < 30; i++) {
                // find next end of row
                for (j = j - 5; body.substr(j, 5) !== "</tr>"; j--) { }

                // set timestamp for db
                let timestamp = new Date(body.substr(j - 116, 10) + " " + body.substr(j - 97, 8));
                data.push({
                    time: timestamp,
                    elev: body.substr(j - 77, 5),
                    flow: "N/A"
                });
                j--;
            };

            callback(null, data);
        });
    }
}