const mongoose = require("mongoose");
var express = require("express"),
  app = express(),
  request = require("request"),
  _ = require("underscore"),
  fs = require('fs');

// var txData = [];

// Require all models
var db = require("../models")();

// // Connect to the Mondo DB
// var databaseUri = 'mongodb://localhost/BassSavvyTestDb';

// if (process.env.MONGODB_URI) {
//   db.connect(process.env.MONGODB_URI);
// } else {
//   db.connect(databaseUri);
// }

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  var $ = require("jquery");
  var request = require("request");
  // API GET Requests
  // ---------------------------------------------------------------------------

  // Route to retrieve a single lake's data from db
  // app.get("/api/lakes/:lakeName", function (req, res) {
  //   let lakeName = req.params.lakeName
  //   db.model("Lake").find({ name: lakeName })
  //     .exec(function (err, data) {
  //       if (err) {
  //         res.send(lakeName + " lake data not found");
  //       } else {
  //         res.json(data)
  //       }
  //     })
  // })


  //Route to retrieve lakes in a specific state
  app.get("/api/states/:state", function (req, res) {
    var data = require("../data/lakeData");
    let state = req.query.state;
    var stateObj = data.find(e => e.state === state);
    res.send(stateObj);
  })

  app.get("/api/lake-data", function(req,res) {
    // Import lake data from lakeData.js
    var data = require("../data/lakeData");
    res.json(data);
  })

  // Route to retrieve ACE data for Kerr Lake
  app.get("/api/kerr", function (request, response) {
    var url = "http://epec.saw.usace.army.mil/dsskerr.txt";
    var indexes = [0, 1, 2, 3, 4]
    getData(10, "Kerr", indexes, url, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data.reverse());
      }
    });

    // Function to pull data
    function getData(col, lakeName, indexes, newUrl, callback) {
      var request = require("request");
      var data = [];

      var options = {
        url: newUrl
      }
      request(options, function (error, response, body) {
        if (error) {
          callback(error);
        }
        _.each(body.split("\r\n"), function (line) {
          // Split the text body into readable lines
          var splitLine;
          line = line.trim();
          splitLine = line.split(/[ ]+/);
          // Check to see if this is a data line
          // Column length and first two characters must match
          if (splitLine.length === col && !isNaN(parseInt(line.substring(0, 2)))) {
            // Loop through each cell and check for missing data
            for (var i = 0; i < splitLine.length; i++) {
              if (splitLine[i].substring(0, 1) === "?" || splitLine[i] == -99) {
                splitLine[i] = "N/A";
              }
            }
            // Formulate the date to remove Month
            let cleanDate = splitLine[indexes[0]].substring(0, 2) + " " + splitLine[indexes[0]].substring(2, 5);
            // Push each line into data object
            data.push({
              lakeName: lakeName,
              date: cleanDate,
              time: splitLine[indexes[1]],
              inflow: splitLine[indexes[2]],
              outflow: splitLine[indexes[3]],
              level: splitLine[indexes[4]]
            });

          }
        });
        callback(null, data);
      });
    }


  });

  // Route to retrieve ACE data for Jordan Lake
  app.get("/api/jordan", function (request, response) {
    var url = "http://epec.saw.usace.army.mil/dssjord.txt";
    var indexes = [0, 1, 8, 9, 10]
    getData(11, "Jordan", indexes, url, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data.reverse());
      }
    });

    // Function to pull data
    function getData(col, lakeName, indexes, newUrl, callback) {
      var request = require("request");
      var data = [];

      var options = {
        url: newUrl
      }
      request(options, function (error, response, body) {
        if (error) {
          callback(error);
        }

        _.each(body.split("\r\n"), function (line) {
          // Split the text body into readable lines
          var splitLine;
          line = line.trim();
          splitLine = line.split(/[ ]+/);
          // Check to see if this is a data line
          // Column length and first two characters must match

          if (splitLine.length === col && !isNaN(parseInt(line.substring(0, 2)))) {
            // Loop through each cell and check for missing data
            for (var i = 0; i < splitLine.length; i++) {
              if (splitLine[i].substring(0, 1) === "?" || splitLine[i] == -99) {
                splitLine[i] = "N/A";
              }
            }
            // Formulate the date to remove Month
            let cleanDate = splitLine[indexes[0]].substring(0, 2) + " " + splitLine[indexes[0]].substring(2, 5);
            // Push each line into data object
            data.push({
              lakeName: lakeName,
              date: cleanDate,
              time: splitLine[indexes[1]],
              inflow: splitLine[indexes[2]],
              outflow: splitLine[indexes[3]],
              level: splitLine[indexes[4]]
            });

          }
        });
        callback(null, data);
      });
    }
  });

  app.get("/api/cube", function (request, response) {
    // Parses our HTML and helps us find elements
    var cheerio = require("cheerio");
    // Makes HTTP request for HTML page
    var request = require("request");

    scrapeCubeData(function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data);
      }
    });

    function scrapeCubeData(callback) {
      // Define our data template
      var data = [{
        lakeName: "High Rock",
        data: []
      }, {
        lakeName: "Badin",
        data: []
      }, {
        lakeName: "Tuckertown",
        data: []
      }];
      // Make request for cub carolinas site, returns html
      request("http://ww2.cubecarolinas.com/lake/tabs.php", function (error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // With cheerio, find each <td> on the page
        // (i: iterator. element: the current element)
        $('tr').each(function (i, element) {
          // var value = $(this).text();
          var value = $(element).children().text();

          // Skip over the first few sections of data to get to the stuff we need
          if (i > 7) {
            // If the current value is high rock
            if (value.substring(0, 1) === "H") {
              date = value.substring(9, 19);
              elev = value.substring(19, 25);
              data[0].data.push({
                date: date,
                elev: elev
              });
            }
            // If the current value is Badin
            if (value.substring(0, 1) === "B") {
              date = value.substring(15, 25);
              elev = value.substring(25, 31);
              data[1].data.push({
                date: date,
                elev: elev
              });
            }
            // If Tuckertown
            if (value.substring(0, 1) === "T") {
              date = value.substring(10, 20);
              elev = value.substring(20, 26);
              data[2].data.push({
                date: date,
                elev: elev
              });
            }
          }
        });
        callback(null, data);
      });
    }
  })

  // This reads the tournament file for the Tournaments Page
  app.get("/api/tournaments", function (request, response) {
    // Import our txData from tournamentData.js file
    var txData = require("../data/tournamentData");
    // Declare array to hold our data to send back to the client
    let data = [];
    // Loop through the high level organizations in our data
    for (var i = 0; i < txData.length; i++) {
      var org = txData[i];
      // Loop through the tournaments within each organization
      for (var k = 0; k < org.tournaments.length; k++) {
        var e = org.tournaments[k];
        // Push each line into output data object
        data.push({
          organizer: e.organizer,
          trail: e.trail,
          date: e.date,
          lake: e.lake,
          ramp: e.ramp,
          state: e.state,
          txDetail: e.txDetail,
          results: e.resultsLink
        });
      }
    }
    response.json(data);

    // This for loop was used to write out the tournament data that was read from a txt file
    /*for (i = 0; i < 196; i++) {
      if (txData[i].organizer == "CATT" && txData[i].trail == "NC/SC Championship") {
        fs.appendFile('newTxData.js', "{organizer: \"" + txData[i].organizer + "\",\r\n", function (err, file) {
          if (err) throw err;
          console.log("Slow me down")
        });
        fs.appendFile('newTxData.js', "trail: \"" + txData[i].trail + "\",\r\n", function (err, file) {
          if (err) throw err;
          console.log("Slow me down")
        });
        fs.appendFile('newTxData.js', "date: \"" + txData[i].date + "\",\r\n", function (err, file) {
          if (err) throw err;
          console.log("Slow me down")
        });
        fs.appendFile('newTxData.js', "lake: \"" + txData[i].lake + "\",\r\n", function (err, file) {
          if (err) throw err;
          console.log("Slow me down")
        });
        fs.appendFile('newTxData.js', "ramp: \"" + txData[i].ramp + "\",\r\n", function (err, file) {
          if (err) throw err;
          console.log("Slow me down")
        });
        fs.appendFile('newTxData.js', "txDetail: \"" + txData[i].txDetail + "\",\r\n", function (err, file) {
          if (err) throw err;
          console.log("Slow me down")
        });
        fs.appendFile('newTxData.js', "resultsLink: \"" + txData[i].results + "\",\r\n", function (err, file) {
          if (err) throw err;
          console.log("Slow me down")
        });
        fs.appendFile('newTxData.js', "entryLink: \"" + "\"}\r\n", function (err, file) {
          if (err) throw err;
          console.log("Slow me down")
        });
      }
    } */

  });

  // Route to retrieve ACE data from A2W
  app.get("/api/a2w", function (request, response) {
    let a2wURL = request.query.a2wURL;

    getData(a2wURL, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data);
      }
    });

    function getData(a2wURL, callback) {
      var request = require("request");
      var data = [];
      request(a2wURL, function (error, response, body) {
        if (error) {
          callback(error);
        }
        data = JSON.parse(body);
        callback(null, data);
      })
    }
  })

  // Route to retrieve TVA data
  app.get("/api/tva", function (request, response) {
    let tvaURL = request.query.tvaDataURL;
    let tvaLakeName = request.query.tvaLakeName;

    getData(tvaLakeName, tvaURL, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data.reverse());
      }
    });

    // Function to pull data
    function getData(lakeName, newUrl, callback) {
      var request = require("request");
      var data = [];
      var options = {
        url: newUrl,
        type: "xml"
      }
      request(options, function (error, response, body) {
        if (error) {
          callback(error);
        }
        let tvaDate = "";
        let tvaTime = "";
        let tvaElev = "";
        let tvaOutFlow = "";
        let tvaOutFlowStart = 0

        _.each(body.split("\r\n"), function (line) {
          // Split the text body into readable lines
          var splitLine;
          line = line.trim();
          splitLine = line.split(/[ ]+/);

          // Check to see if this is a data line by checking for keywords
          if (line.substring(1, 6) == "LOCAL") {
            // It's a date time line, save the date and time
            // Formulate the date 
            tvaDate = splitLine[0].substr(15, 9);
            // Formulate the time
            tvaTime = splitLine[1] + " " + splitLine[2] + " " + splitLine[3].substr(0, 3);
          }

          if (line.substring(1, 6) == "UPSTR") {
            // It's an elevation level line, save the elevation
            tvaElev = line.substring(18, 24)
          }
          
          if (line.substring(1, 4) == "AVG") {
            // Last Data item
            // Set the outFlowStart to 25 (5 char outFlow
            tvaOutFlowStart = 25;
            if (line.substring(24, 25) != " " && line.substring(23, 24) != " ")
              tvaOutFlowStart = 23;
            else if (line.substring(24, 25) != " ")
              tvaOutFlowStart = 24;
            tvaOutFlow = line.substring(tvaOutFlowStart, 30)
            // Push each line into data object
            data.push({
              lakeName: lakeName,
              date: tvaDate,
              time: tvaTime,
              outflow: tvaOutFlow,
              level: tvaElev
            });
          }
        });
        callback(null, data);
      });
    }
  });

  app.get("/api/alabama", function (request, response) {
    var lakeRoute = request.query.lakeRoute;
    // Parses our HTML and helps us find elements
    var cheerio = require("cheerio");
    // Makes HTTP request for HTML page
    var request = require("request");

    scrapeAlabData(lakeRoute, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data);
      }
    });

    function scrapeAlabData(lakeRoute, callback) {
      // Set the base of the request depending on which lake we want
      var url = "";
      switch (lakeRoute) {
        case "smith":
          url = "http://www.smithlake.info/Level/Calendar"
          break;

        case "neelyhenry":
          url = "http://www.neelyhenry.uslakes.info/Level/Calendar"
          break;

        case "loganmartin":
          url = "http://www.loganmartin.info/Level/Calendar"
          break;

        case "lay":
          url = "http://www.laylake.info/Level/Calendar"
          break;

        case "weiss":
          url = "http://www.lakeweiss.info/Level/Calendar"
          break;
      }

      // Get today's date to build request url
      var today = new Date();
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
        var mm2 = (((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) - 1); // Same fancy conversion except -1 added on the end to get previous month
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
            data.unshift({
              date: dd + "/" + mm2 + "/" + yyyy2,
              time: "6:00",
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
              data.unshift({
                date: dd + "/" + mm + "/" + yyyy,
                time: "6:00",
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
  })




  // API POST Requests
  // ---------------------------------------------------------------------------

  // Route to update database with new lake data
  // app.post("/api/usgs", (req, res) => {
  //   console.log("nameID: " + req.body.nameID)
  //   req.body.newBatch.forEach(function (e) {
  //     db.model('Lake').updateOne({
  //       _id: ObjectId(req.body.nameID),
  //       data: [{
  //         level: e.value,
  //         date: e.date,
  //         time: e.time
  //       }]
  //     })
  //       .then(function (data) {
  //         res.json(data);
  //       })
  //       .catch(function (err) {
  //         res.json(err);
  //       });
  //   })
  // });


  //Start of dukeData
  // Route to retrieve DUKE data
  app.get("/api/duke", function (request, response) {
    let dukeURL = request.query.dukeDataURL;
    let dukeLakeName = request.query.dukeLakeName;

    getData(dukeLakeName, dukeURL, function (error, data) {
      if (error) {
        response.send(error);
        return;
      } else {
        response.json(data.reverse());
      }
    });

    // Function to pull data
    function getData(lakeName, newUrl, callback) {
      var request = require("request");
      var data = [];
      var options = {
        url: newUrl,
        type: "xml"
      }
      request(options, function (error, response, body) {
        if (error) {
          callback(error);
        }
        let dukeLakes = JSON.parse(body);

        callback(null, dukeLakes);
      });
    }
  });

  //End of dukeData



  function writeTxListJSON() {

    var txJSONList = [

      {

        organization: "ABA",

        tournaments: [

          {
            trail: "VA Area 8"
          }

        ]

      },
      {

        organization: "Anglers",

        tournaments: [{
            trail: "Team Trail"
          }

        ]
      },
      {

        organization: "BFL",

        tournaments: [

          {
            trail: "Piedmont"
          },
          {
            trail: "Shenandoah"
          }

        ]

      },
      {
        organization: "CATT",

        tournaments: [

          {
            trail: "Clarks Hill"
          },

          {
            trail: "Coastal (SC)"
          },
          {
            trail: "Cooper River"
          },
          {

            trail: "East (NC)"
          },
          {
            trail: "Lake Hartwell"
          },

          {
            trail: "Hickory"
          },
          {
            trail: "James River"
          },

          {
            trail: "Kerr Lake"
          },
          {
            trail: "Norman"
          },
          {
            trail: "NC/SC Championship"
          },
          {
            trail: "Old North"
          },
          {
            trail: "Robinson"
          },

          {
            trail: "Santee Cooper"
          },
          {
            organizer: "CATT"
          },

          {
            trail: "Sparkleberry"
          },

          {
            trail: "Waccamaw"
          },

          {
            trail: "Wateree Open"
          },
          {
            trail: "Wateree"
          },
          {
            trail: "Lake Wylie"
          },
          {
            trail: "Yadkin"
          }

        ]
      },
      {

        organization: "CBC",

        tournaments: [{
            trail: "SC",
          },
          {
            trail: "NC"
          }

        ]

      },
      {

        organization: "Collins",

        tournaments: [{
            trail: "BFCS"
          }

        ]

      },
      {

        organization: "PBC",

        tournaments: [{
            trail: "Spring Team"
          }, {
            trail: "Cashion"
          }

        ]

      }

    ]; // End of TxJSONList



    // This for loop was used to write out the tournament data that was read from a txt file

    fs.open('newTxData.js', 'w', function (err, file) {
      if (err) throw err;
      console.log('Saved!');
    });
    fs.appendFile('newTxData.js', "var txData = [  \r\n\r\n\r\n", function (err, file) {
      if (err) throw err;
    });
    for (j = 0; j < txJSONList.length; j++) {
      if (j !== 0)
        fs.appendFile('newTxData.js', ",\r\n", function (err, file) {
          if (err) throw err;
          console.log("Slow me down");
        });
      fs.appendFile('newTxData.js', "{organization: \"" + txJSONList[j].organization + "\",\r\n", function (err, file) {
        if (err) throw err;
      });
      fs.appendFile('newTxData.js', "tournaments: [ \r\n\r\n", function (err, file) {
        if (err) throw err;
      });
      for (k = 0; k < txJSONList[j].tournaments.length; k++) {
        for (i = 0; i < 196; i++) {
          if (txData[i].organizer == txJSONList[j].organization)
            if (txData[i].trail == txJSONList[j].tournaments[k].trail) {
              fs.appendFile('newTxData.js', ",\r\n{organizer: \"" + txData[i].organizer + "\",\r\n", function (err, file) {
                if (err) throw err;
                console.log("Slow me down");
                console.log("Slow me down");
              });
              fs.appendFile('newTxData.js', "trail: \"" + txData[i].trail + "\",\r\n", function (err, file) {
                if (err) throw err;
                console.log("Slow me down");
                console.log("Slow me down");
              });
              fs.appendFile('newTxData.js', "date: \"" + txData[i].date + "\",\r\n", function (err, file) {
                if (err) throw err;
                console.log("Slow me down");
                console.log("Slow me down");
              });
              fs.appendFile('newTxData.js', "lake: \"" + txData[i].lake + "\",\r\n", function (err, file) {
                if (err) throw err;
                console.log("Slow me down");
                console.log("Slow me down");
              });
              fs.appendFile('newTxData.js', "ramp: \"" + txData[i].ramp + "\",\r\n", function (err, file) {
                if (err) throw err;
                console.log("Slow me down");
                console.log("Slow me down");
              });
              fs.appendFile('newTxData.js', "state: \"" + txData[i].state + "\",\r\n", function (err, file) {
                if (err) throw err;
                console.log("Slow me down");
                console.log("Slow me down");
              });
              fs.appendFile('newTxData.js', "txDetail: \"" + txData[i].txDetail + "\",\r\n", function (err, file) {
                if (err) throw err;
                console.log("Slow me down");
                console.log("Slow me down");
              });
              fs.appendFile('newTxData.js', "resultsLink: \"" + txData[i].results + "\",\r\n", function (err, file) {
                if (err) throw err;
                console.log("Slow me down");
                console.log("Slow me down");
              });
              fs.appendFile('newTxData.js', "entryLink: \"" + "\"}\r\n", function (err, file) {
                if (err) throw err;
                console.log("Slow me down");
                console.log("Slow me down");
              });
            }
        }; // End of for i loop (finished looping through txData)
        if (k == txJSONList[j].tournaments.length - 1) {
          fs.appendFile('newTxData.js', "]\r\n} \r\n", function (err, file) {
            if (err) throw err;
            console.log("Slow me down");
            console.log("Slow me down");
          });
        }
      }; //End of for k loop (finished a trail)
    }; // End of for j loop (finished and Organization)
    fs.appendFile('newTxData.js', "] \r\n", function (err, file) {
      if (err) throw err;
      console.log("Slow me down");
      console.log("Slow me down");
    });
  }; // End of writeTxListJSON function


}; // End of module.exports