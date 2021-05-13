const request = require("request")
const cheerio = require("cheerio");
const db = require("../../models")();
const update = require('../updateFunctions');


module.exports = {

  // APC UPDATE FUNCTION
  // ===============================================================================
  // function to get Alabama Power Company data
  getAPCData: function (currentLake, callback) {
    let apcURL = currentLake.elevURL;
    var options = {
      url: apcURL,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; rv:1.9.2.16) Gecko/20110319 Firefox/3.6.16'
      }
    }
    request(options, function (error, response, html) {
      let localHTML = html;
      // Define our data template
      var data = [];
      // Make request for Alabama Power Company site, returns html
      //request(apcURL, function (error, response, html) {

      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'

      if (error) {
        callback(error);
      } else {
        console.log(`${currentLake.bodyOfWater} apcdata`)
        let dataErrorTrue = false;
        try {
          var $ = cheerio.load(localHTML);
        console.log(`${localHTML} apcdata`)
        } catch (error) {
          console.error(error);
          dataErrorTrue = true;
        }

        if (!dataErrorTrue) {

          let apcElev = "";
          let apcFlow = "";
          let apcTime = "";
          let apcDate = "";
          let year = "";

          console.log("Here");
          // With cheerio, find each <td> on the page
          // (i: iterator. element: the current element)
          $(".lake-specs-level,.lake-message-wrapper,.flow").each(function (i, element) {
            let waterLevel = element.attribs.class == "lake-specs-level";
            let updateDate = element.attribs.class == "lake-message-wrapper";
            let flowLevel = element.attribs.class == "flow";

            var value = $(element).text();
            if (waterLevel) {
              apcElev = Number($(element).children().text().substr(11, 3) + '.' + $(element).children().text().substr(18, 1))
            } else if (updateDate) {
              let temp = $(`.msg-update`).text();
              //temp = temp.substr(13);
              apcTime = new Date();
              apcTime.setMinutes(0);
              apcTime.setSeconds(0);
            } else {
              let splitFlow = value.split(" ");
              splitFlow = splitFlow[0];
              apcFlow = Number(splitFlow.trim().replace(",", ""));
            }

          });
        console.log(`${apcElev} APC Elev`)
          if (apcElev !== 0) // If elev not 0 (ie, unposted data)
            data.push({
              elev: apcElev,
              time: apcTime,
              flow: apcFlow
            });
          callback(false, data);
        } else {
          callback(true, html)
        }
      }
    });
  }

}