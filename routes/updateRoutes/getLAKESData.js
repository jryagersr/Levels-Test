const request = require("request");
const cheerio = require("cheerio");
const db = require("../../models")();


module.exports = {

    // USLAKES UPDATE FUNCTION
    // ===============================================================================
    // function to get USLAKES data
    getLAKESData: function (currentLake, callback) {
        let bodyOfWater = currentLake.bodyOfWater;
        // Set the base of the request depending on which lake we want
        var url = "";
        switch (bodyOfWater) {

            // case "Columbus":
            //     url = "http://columbus.lakesonline.com/Level/Calendar"
            //     break;

            case "xxx":
                url = currentLake.elevURL;
                break;


        }

        // Get today's date to build request url
        var today = new Date();
        // Next line converts month number to 2 digits
        var mm = ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1); //Fancy conversion because .getMonth() will return numbers 0-12, but we need two digits months to build url
        var yyyy = today.getFullYear();
        var date = "/" + yyyy + "/" + mm;

        // Define and build previous month's date for second scrape
        var yyyy2 = "";
        var mm2 = "";
        if (mm === "01") {
            mm2 = "12"
            yyyy2 = today.getFullYear() - 1;
            date2 = "/" + yyyy2 + "/" + mm2;
        } else {
            yyyy2 = today.getFullYear();
            var mm2 = "0" + (((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) - 1); // Same fancy conversion except -1 added on the end to get previous month
            var date2 = "/" + yyyy2 + "/" + mm2;
        }

        // Define our data template
        var data = []

        // Make request for previous months lakelevels.info site, returns html
        request(url, function (error, html) {

            if (typeof html !== 'undefined') {
                //console.log('getUSLAKES ', bodyOfWater);
                // Load the HTML into cheerio and save it to a variable
                var $ = cheerio.load(html);
                // Simple day increment counter to build date later
                var dd = 1;
                // With cheerio, find each <td> on the page
                // (i: iterator. element: the current element)
                let x = $('strong').text;
                $('strong').each(function (i, element) {
                    var value = $(element).text();
                    if (!isNaN(value) && value.length === 5) {
                        // format timestamp for db
                        let month = parseInt(mm2) - 1; //JS counts numbers from 0-11 (ex. 0 = January)
                        let timestamp = new Date(yyyy2, month, dd, "6");
                        data.unshift({
                            time: timestamp,
                            elev: value,
                            flow: "N/A"
                        });
                        dd++;
                    }
                    callback(false, data);
                })
            } else {
                callback(false, html)
            }

        });
    }

}