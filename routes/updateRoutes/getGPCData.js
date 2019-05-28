const request = require("request")
const cheerio = require("cheerio");
const db = require("../../models")();
const update = require('../updateFunctions');


module.exports = {

  // APC UPDATE FUNCTION
  // ===============================================================================
  // function to get Georgia Power Company data
  getGPCData: function (gpcURL, bodyOfWater, callback) {
    var options = {
      url: gpcURL,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; rv:1.9.2.16) Gecko/20110319 Firefox/3.6.16'
      }
    }
    request(options, function (error, response, html) {

      //console.log ("GPC Call", bodyOfWater);
      //console.log('getGPC ', bodyOfWater);
      // Define our data template
      var data = [];
      // Make request for Georgia Power Company site, returns html
      //request(apcURL, function (error, response, html) {

      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      //console.log(html)
      var $ = cheerio.load(html);
      let gpcElev = "";
      let gpcTime = "";
      let gpcDate = "";
      let splitName = "";
      let splitDate = "";
      let tdCount = 0;

      // With cheerio, find each <td> on the page
      // (i: iterator. element: the current element)
      $("td").each(function (i, element) {

        //get the date/time
        if (gpcDate == "") {
          splitDate = $(`#MainContent_LastUpdatedLabel`).text().split(" ");
          gpcDate = splitDate[4];
          gpcTime = splitDate[6] + " " + splitDate[7];

          // format timestamp for database
          let splitTime = gpcTime.split(" ");
          splitDate = gpcDate.split("/");
          let year = "20" + splitDate[2];
          let month = parseInt(splitDate[0]) - 1; //JS counts numbers from 0-11 (ex. 0 = January)
          let day = splitDate[1];
          splitTime = gpcTime.split(" ");
          let splitHour = splitTime[0].split(":");
          let hour = splitHour[0];
          if (hour === "12" && splitTime[2] === "AM") {
            hour = 0;
          } else if (hour !== "12" && splitTime[2] === "PM") {
            hour = parseInt(hour) + 12;
          }
          gpcTime = new Date(year, month, day, hour);


        }

        if (tdCount > 0) // Then we've found the line for this lake, skip 4 tds
          tdCount++
        if (tdCount == 0) {
          //Some lake names have the dam name in parens following the  name
          if (typeof element.children[0].data !== "undefined")
            splitName = element.children[0].data.split(" ");
        }
        if (splitName[0] == bodyOfWater && tdCount == 0) {
          tdCount++
        }
        if (tdCount == 4) { // skipped 4, we now have the Elevation.
          gpcElev = Number(element.children[0].data);
        }

      });
      if (gpcElev !== 0)  // If elev not 0 (ie, unposted data)
        data.push({
          elev: gpcElev,
          time: gpcTime,
          flow: "N/A"
        });
      callback(null, data);

    });
  }

}