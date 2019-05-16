const request = require("request");
const cheerio = require("cheerio");
const db = require("../../models")();
const update = require('../updateFunctions');


module.exports = {

    // USLAKES UPDATE FUNCTION
    // ===============================================================================
    // function to get USLAKES data
    getUSLAKESData: function (bodyOfWater, callback) {
        // Set the base of the request depending on which lake we want
        var url = "";
        switch (bodyOfWater) {
            
            case "Columbus":
                url = "http://columbus.lakesonline.com/Level/Calendar"
                break;

            case "Oconee":
                url = "http://oconee.uslakes.info/Level/Calendar"
                break;

            case "Oneida":
                url = "http://oneida.uslakes.info/Level/Calendar"
                break;

            case "Gaston":
                url = "http://gaston.uslakes.info/Level/Calendar"
                break;

            case "Smith Mountain":
                url = "http://smithmountain.uslakes.info/Level/Calendar"
                break;

            case "Sinclair":
                url = "http://sinclair.uslakes.info/Level/Calendar"
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
        request(url + date2, function (error, response, html) {

            // Load the HTML into cheerio and save it to a variable
            var $ = cheerio.load(html);
            // Simple day increment counter to build date later
            var dd = 1;
            // With cheerio, find each <td> on the page
            // (i: iterator. element: the current element)
            $("font").each(function (i, element) {
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
            })

            // Make second request for current month's lakelevels.info site
            request(url + date, function (error, response, html) {

                // Load the HTML into cheerio and save it to a variable
                var $ = cheerio.load(html);
                // Simple day increment counter to build date later
                var dd = 1;
                // With cheerio, find each <td> on the page
                // (i: iterator. element: the current element)
                $("font").each(function (i, element) {
                    var value = $(element).text();
                    if (!isNaN(value) && value.length === 5) {
                        let month = parseInt(mm) - 1; //JS counts numbers from 0-11 (ex. 0 = January)
                        let timestamp = new Date(yyyy, month, dd, "6");
                        data.unshift({
                            time: timestamp,
                            elev: value,
                            flow: "N/A"
                        });
                        dd++;
                    }
                })
                callback(null, data);
            });
        });
    }

}