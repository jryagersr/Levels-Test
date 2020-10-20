const request = require("request")
const cheerio = require("cheerio");
const db = require("../../models")();
const update = require('../updateFunctions');
const weather = require("../updateRoutes/getWeatherData");


module.exports = {

  // DE UPDATE FUNCTION
  // ===============================================================================
  // function to get Dominion Energy data
  getDEData: function (currentLake, callback) {
    let deURL = currentLake.elevURL;
    let bodyOfWater = currentLake.bodyOfWater;
    var options = {
      url: deURL,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; rv:1.9.2.16) Gecko/20110319 Firefox/3.6.16'
      }
    }
    request(options, function (error, response, html) {

      // Define our data template
      var data = [];
      // Make request for Georgia Power Company site, returns html
      //request(apcURL, function (error, response, html) {

      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'

      if (error) {
        callback(true, error, html);
      } else {
        let dataErrorTrue = false;
        try {
          var $ = cheerio.load(html);
        } catch (error) {
          console.error(error);
          dataErrorTrue = true;
        }

        if (!dataErrorTrue) {
          let deElev = "";
          let deTime = "";
          let deDate = "";
          //let splitName = "";
          //let splitDate = "";
          let splitData = "";

          // With cheerio, find each <td> on the page
          // (i: iterator. element: the current element)
          $('td').each(function (i, element) {
            var value = $(element).text();
            if (i == 0) {
              splitData = value.split('/');


              //get the date/time

              // format timestamp for database
              let year = splitData[2].trim();
              let month = parseInt(splitData[0].trim() - 1); //JS counts numbers from 0-11 (ex. 0 = January)
              let day = splitData[1].trim();
              let hour = "8"; // Always 8 AM

              deTime = new Date(year, month, day, hour);
            }
            //Get the average water level
            if (i == 2) {
              deElev = value;
            }
          });
          if (deElev !== 0) // If elev not 0 (ie, unposted data)
            data.push({
              elev: deElev,
              time: deTime,
              flow: "N/A"
            });
          callback(false, data);
        } else {
          callback(true, html)
        }
      }
    });
  }

}