const request = require("request")
const cheerio = require("cheerio");
const db = require("../../models")();
const update = require('../updateFunctions');
const weather = require("../updateRoutes/getWeatherData");


module.exports = {

  //  ACEWilm UPDATE FUNCTION
  // ===============================================================================
  // function to get ACE Wilmington data
  getACEWilmData: function (currentLake, callback) {
    let acewilmURL = currentLake.elevURL;
    let bodyOfWater = currentLake.bodyOfWater;
    var options = {
      url: acewilmURL,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; rv:1.9.2.16) Gecko/20110319 Firefox/3.6.16'
      }
    }
    let dataErrorTrue = false;
    request(options, function (error, response, html) {
      if (error) {
        callback(error);
      } else {
        // Define our data template
        var data = [];
        try {
          var $ = cheerio.load(html);
        } catch (error) {
          console.error(error);
          dataErrorTrue = true;
        }
      }

      if (!dataErrorTrue) {
        //console.log("ACEWilm Call", bodyOfWater);


        let acewilmElev = "";
        let acewilmTime = "";
        let acewilmDate = "";

        if (bodyOfWater == "Smith Mountain")
          acewilmElev = html.substr(2727, 6);

        if (bodyOfWater == "Leesville")
          acewilmElev = html.substr(2740, 6);

        if (bodyOfWater == "Roanoke Rapids")
          acewilmElev = html.substr(2760, 6);

        if (bodyOfWater == "Gaston")
          acewilmElev = html.substr(2750, 6);

        //get the date/time
        acewilmDate = html.substr(732, 9);

        // format timestamp for database
        let year = acewilmDate.substr(5, 4);
        let month = acewilmDate.substr(2, 3);
        month = new Date(`${month} 1`);
        month = month.getMonth();
        let day = acewilmDate.substr(0, 2);
        let hour = "0"; // Always 12 PM

        acewilmTime = new Date(year, month, day, hour);

        if (acewilmElev !== 0) // If elev not 0 (ie, unposted data)
          data.push({
            elev: acewilmElev,
            time: acewilmTime,
            flow: "N/A"
          });
        callback(false, data);
      } else {
        callback(true, html)
      }
    });


  }
}