const express = require("express"),
  db = require("../models")();

const request = require("request")
// Import all data source update functions
const ace = require('./updateRoutes/getACEData');
const acewilm = require('./updateRoutes/getACEWilmData');
const apc = require('./updateRoutes/getAPCData');
const cube = require("./updateRoutes/getCUBEData");
const de = require('./updateRoutes/getDEData');
const duke = require("./updateRoutes/getDUKEData");
const gpc = require('./updateRoutes/getGPCData');
const sjrwmd = require("./updateRoutes/getSJRWMDData");
const tva = require("./updateRoutes/getTVAData");
const twdb = require("./updateRoutes/getTWDBData");
const usgs = require("./updateRoutes/getUSGSData");
const uslakes = require("./updateRoutes/getLAKESData");
const weatherwater = require("./updateRoutes/getWEATHERWATERData");
const http = require("http");

// Import update functions for updating lake levels, weather and forecast
var update = require('./updateFunctions');



// // Connect to the Mondo DB
const databaseUri = 'mongodb://localhost/BassSavvyTestDb';


if (process.env.MONGODB_URI) {
  db.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  });
  console.log("MongoDB remote connection successful");
} else {
  db.connect(databaseUri, {
    useNewUrlParser: true
  });
  console.log("MongoDB local connection successful");
}

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {

  // ===============================================================================
  // GET ROUTES
  // ===============================================================================

  // Route to retrieve a single lake's data from db
  app.get("/api/find-one-lake", function (req, res) {
    let lakeName = req.query.lakeName;
    // match off of href because this value has no caps and no spaces
    // matching off lakename alone requires modifying our entire database
    let hrefMatch = "/lakes/" + lakeName;
    let noLakeDataSource = false;
    db.model("Lake").find({
        "href": hrefMatch
      })
      .exec(function (err, data) {
        if (err) {
          res.send("There was a problem querying the database");
        } else {
          if (data.length == 0) {
            // if no lake was found in the database, lake does not exist
            res.status(404).send("404: Page not Found");
          } else {
            // set currentLake equal to returned lake document
            let currentLake = data[0];

            //check to see if update is needed (function returns true if update is needed)
            //if not retrieve data and update the db, then return the retrieved data
            //console.log(`${currentLake.bodyOfWater} UPDATE CHECK0 1 Lake Level`)
            if (update.checkForUpdate(currentLake, 0)) {
              // update current lake
              // determine which data source and run function
              console.log(`${currentLake.bodyOfWater} Update 1 Lake Level ${currentLake.lastRefresh}`)
              switch (currentLake.dataSource[0]) {

                case "ACE":
                  ace.getACEData(currentLake, function (error, ACEdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + "- ACEData error " + ACEdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, ACEdata, function (error, ACElakeDataFlag, ACEdata) {
                        if (error) {
                          console.log(`UAROL error  ${ACEdata}`);
                        }
                        processChartElevData(ACEdata, currentLake);
                        res.json(ACEdata);
                      })
                    }
                  });
                  break;

                case "ACEWilm":
                  acewilm.getACEWilmData(currentLake, function (error, ACEWilmdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + "- ACEWilmData error " + ACEWilmdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, ACEWilmdata, function (error, ACEWilmlakeDataFlag, ACEWilmdata) {
                        if (error) {
                          console.log(`UAROL error  ${ACEWilmdata}`);
                        }
                        processChartElevData(ACEWilmdata, currentLake);
                        res.json(ACEWilmdata);
                      })
                    }
                  });
                  break;

                case "APC":
                  apc.getAPCData(currentLake, function (error, APCdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + "- APCData error " + APCdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, APCdata, function (error, APClakeDataFlag, APCdata) {
                        if (error) {
                          console.log(`UAROL error  ${APCdata}`);
                        }
                        processChartElevData(APCdata, currentLake);
                        res.json(APCdata);
                      })
                    }
                  });
                  break;

                case "CUBE":
                  cube.getCUBEData(currentLake, function (error, CUBEdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + "- CUBEData error " + CUBEdata);
                      response.send(CUBEdata);
                    } else {
                      // if successful return the data
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, CUBEdata, function (error, CUBElakeDataFlag, CUBEdata) {
                        if (error) {
                          console.log(`UAROL error  ${CUBEdata}`);
                        }
                        processChartElevData(CUBEdata, currentLake);
                        res.json(CUBEdata);
                      })
                    }
                  })
                  break;

                case "DE":
                  de.getDEData(currentLake, function (error, DEdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + "- DEData error " + DEdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, DEdata, function (error, DElakeDataFlag, DEdata) {
                        if (error) {
                          console.log(`UAROL error  ${DEdata}`);
                        }
                        processChartElevData(DEdata, currentLake);
                        res.json(DEdata);
                      })
                    }
                  });
                  break;


                case "DUKE":
                  duke.getDUKEData(currentLake, function (error, DUKEdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + "- DUKEData error " + DUKEdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, DUKEdata, function (error, DUKElakeDataFlag, DUKEdata) {
                        if (error) {
                          console.log(`UAROL error  ${DUKEdata}`);
                        }
                        processChartElevData(DUKEdata, currentLake);
                        res.json(DUKEdata);
                      })
                    }
                  });
                  break;

                case "GPC":
                  gpc.getGPCData(currentLake, function (error, GPCdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + "- GPCData error " + GPCdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, GPCdata, function (error, GPClakeDataFlag, GPCdata) {
                        if (error) {
                          console.log(`UAROL error  ${GPCdata}`);
                        }
                        processChartElevData(GPCdata, currentLake);
                        res.json(GPCdata);
                      })
                    }
                  });
                  break;

                case "SJRWMD":
                  sjrwmd.getSJRWMDData(currentLake, function (error, SJRWMDdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + "- SJRWMDData error " + SJRWMDdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, SJRWMDdata, function (error, SJRWMDlakeDataFlag, SJRWMDdata) {
                        if (error) {
                          console.log(`UAROL error  ${SJRWMDdata}`);
                        }
                        processChartElevData(SJRWMDdata, currentLake);
                        res.json(SJRWMDdata);
                      })
                    }
                  });
                  break;

                case "TVA":
                  tva.getTVAData(currentLake, function (error, TVAdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + "- TVAData error " + TVAdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, TVAdata, function (error, TVAlakeDataFlag, TVAdata) {
                        if (error) {
                          console.log(`UAROL error  ${TVAdata}`);
                        }
                        processChartElevData(TVAdata, currentLake);
                        res.json(TVAdata);
                      })
                    }
                  });
                  break;

                case "TWDB":
                  twdb.getTWDBData(currentLake, function (error, TWDBdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + "- TWDBData error " + TWDBdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, TWDBdata, function (error, TWDBlakeDataFlag, TWDBdata) {
                        if (error) {
                          console.log(`UAROL error  ${TWDBdata}`);
                        }
                        processChartElevData(TWDBdata, currentLake);
                        res.json(TWDBdata);
                      })
                    }
                  });
                  break;

                case "LAKES":
                  uslakes.getLAKESData(currentLake, function (error, LAKESdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + "- LAKESData error " + LAKESdata);
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, LAKESdata, function (error, USLAKESlakeDataFlag, LAKESdata) {
                        if (error) {
                          console.log(`UAROL error  ${LAKESdata}`);
                        }
                        processChartElevData(LAKESdata, currentLake);
                        res.json(LAKESdata);
                      })
                    }
                  });
                  break;

                case "USGS":
                  usgs.getUSGSData(currentLake, function (error, USGSdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + "- USGSData error " + USGSdata);
                      res.json(currentLake);
                    } else { // if successful return the data
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, USGSdata, function (error, USGSlakeDataFlag, USGSdata) {
                        if (error) {
                          console.log(`UAROL error  ${USGSdata}`);
                        }
                        processChartElevData(USGSdata, currentLake);
                        res.json(USGSdata);
                      })
                    }
                  });
                  break;

                case "WEATHERWATER":
                  weatherwater.getWEATHERWATERData(currentLake, function (error, WEATHERWATERdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + "- WEATHERWATERData error " + WEATHERWATERdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, WEATHERWATERdata, function (error, WEATHERWATERlakeDataFlag, WEATHERWATERdata) {
                        if (error) {
                          console.log(`UAROL error  ${WEATHERWATERdata}`);
                        }
                        processChartElevData(WEATHERWATERdata, currentLake);
                        res.json(WEATHERWATERdata);
                      })
                    }
                  });
                  break;

                default:
                  console.log(`No data source for ${currentLake.bodyOfWater} (findOne)`);
                  noLakeDataSource = true;
                  // Need to update the current conditions and forecast for this lake since the elev data did not need an update

                  // If a Lake Levels update is needed and there is no source for data
                  // We must still check for update of the current conditions

                  // Check to see if Current Conditions needs to be updated
                  //console.log(`${currentLake.bodyOfWater} UPDATE CHECK1 Current Conditions`)
                  if (update.checkForUpdate(currentLake, 1)) {
                    //update the current conditions
                    update.updateCurrentConditionsData(currentLake);
                  }
                  //Return the updated current conditions to the client
                  res.json(currentLake);
              }

            } else {
              // if a Lake Levels update is NOT needed
              // Need to update the current conditions for this lake

              // Check to see if Current Conditions needs to be updated
              //console.log(`${currentLake.bodyOfWater} UPDATE CHECK2 Current Conditions`)
              if (update.checkForUpdate(currentLake, 1)) {
                // Update the current conditions 
                update.updateCurrentConditionsData(currentLake);
              }
              currentLake.data.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.time) - new Date(a.time);
              });
              // return the current conditions to the client
              res.json(currentLake);
            }

            // if no update is needed, send currentLake to client side
            // need to update the current conditions and forecast for this lake since the elev data did not need an update

            // Check to see if Current Conditions needs to be updated
            //console.log(`${currentLake.bodyOfWater} UPDATE CHECK3 Current Conditions`)
            if (update.checkForUpdate(currentLake, 1)) {
              update.updateCurrentConditionsData(currentLake);
            }

            // log that the lake was updated and return it
            //console.log(`UPDATE COMPLETE for ${updateData.bodyOfWater} (${updateData.dataSource[0]})`);

            if (noLakeDataSource) {

            }
          }
        }
      })
  })

  // Route to retrieve a state's lakes data from db
  app.get("/api/find-one-state", function (req, res) {
    let stateName = req.query.stateName;
    // we can match off statename for this route because the client has done the conversion from id to full name
    db.model("Lake").find({
        "state": stateName
      })
      .exec(function (err, data) {
        if (err) {
          res.send("There was a problem querying the database");
        } else {
          data.sort(function (x, y) {
            var a = x.bodyOfWater.toUpperCase(),
              b = y.bodyOfWater.toUpperCase();
            if (a > b) {
              return 1;
            }
            if (a < b) {
              return -1;
            }
            return 0;
          });
          let stateLakes = data;
          res.json(stateLakes);
        }
      })
  })

  // route to retrieve all lake data from the database
  app.get("/api/find-all-lakes", function (req, res) {
    let globalError = false;
    // we can match off statename for this route because the client has done the conversion from id to full name
    db.model("Lake").find({})
      .exec(function (err, data) {
        if (err) {
          res.send("There was a problem querying the database");
        } else {
          res.json(data);
        }
      })
  })
}; // End of module.exports


let totDataUpdate = 0;
var totUpdateCounter = 0;
var totCounter = 0;
let updateCounter = 0;
let dataUpdated = 0;
let startServerCount = 0;

// function to update all lakes in the database
function updateAllLakes() {
  let globalError = false;
  db.model("Lake").find({})
    .exec(function (err, data) {
      if (err) {
        res.send("There was a problem querying the database");
      } else {
        // initiate counter
        let i = 0;
        // start timer
        var timer = setInterval(function () {
            // set currentLake equal to returned lake document
            let currentLake = data[i];

            //check to see if update is needed for lake elevation level 
            //(function returns true if update is needed)
            //console.log(`${currentLake.bodyOfWater} UPDATE CHECK4 Lake Level`)
            if ((currentLake.lastRefresh == '12/31/18'))
              console.log(`***${currentLake.bodyOfWater} Update All Lake Level ${currentLake.lastRefresh}`)
            //else console.log(`${currentLake.bodyOfWater} Update All Lake Level ${currentLake.lastRefresh}`)
            if (update.checkForUpdate(currentLake, 0)) {
              // update current lake
              // determine which data source and run function
              updateCounter++;
              switch (currentLake.dataSource[0]) {

                case "ACE":
                  ace.getACEData(currentLake, function (error, ACEdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + " " + ACEdata)

                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, ACEdata, function (error, ACElakeDataFlag, ACEdata) {
                        if (error) {
                          console.log(`UROL error  ${ACEdata}`);
                        }
                        if (ACElakeDataFlag) {
                          dataUpdated++;
                          processChartElevData(ACEdata, currentLake);
                        }
                      })
                    }
                  });
                  break;

                case "ACEWilm":
                  acewilm.getACEWilmData(currentLake, function (error, ACEWilmdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + " ACEWilm data error")
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, ACEWilmdata, function (error, ACEWilmlakeDataFlag, ACEWilmdata) {
                        if (error) {
                          console.log(`UALL error  ${ACEWilmdata}`);
                        }
                        if (ACEWilmlakeDataFlag) {
                          dataUpdated++;
                          processChartElevData(ACEWilmdata, currentLake);
                        }
                      })
                    }
                  });
                  break;

                case "APC":
                  apc.getAPCData(currentLake, function (error, APCdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + " APC data error")
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, APCdata, function (error, APClakeDataFlag, APCdata) {
                        if (error) {
                          console.log(`UALL error  ${APCdata}`);
                        }
                        if (APClakeDataFlag) {
                          dataUpdated++;
                          processChartElevData(APCdata, currentLake);
                        }
                      })
                    }
                  });
                  break;

                case "CUBE":
                  cube.getCUBEData(currentLake, function (error, CUBEdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + " CUBE data error")
                    } else {
                      // if successful return the data
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, CUBEdata, function (error, CUBElakeDataFlag, CUBEdata) {
                        if (error) {
                          console.log(`UALL error  ${CUBEdata}`);
                        }
                        if (CUBElakeDataFlag) {
                          dataUpdated++;
                          processChartElevData(CUBEdata, currentLake);
                        }
                      })
                    }
                  })
                  break;

                case "DE":
                  de.getDEData(currentLake, function (error, DEdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + " DE data error")
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, DEdata, function (error, DElakeDataFlag, DEdata) {
                        if (error) {
                          console.log(`UALL error  ${DEdata}`);
                        }
                        if (DElakeDataFlag) {
                          dataUpdated++;
                          processChartElevData(DEdata, currentLake);
                        }
                      })
                    }
                  });
                  break;

                case "DUKE":
                  duke.getDUKEData(currentLake, function (error, DUKEdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + " DUKE data error")
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, DUKEdata, function (error, DUKElakeDataFlag, DUKEdata) {
                        if (error) {
                          console.log(`UALL error  ${DUKEdata}`);
                        }
                        if (DUKElakeDataFlag) {
                          dataUpdated++;
                          processChartElevData(DUKEdata, currentLake);
                        }
                      })
                    }
                  });
                  break;

                case "GPC":
                  gpc.getGPCData(currentLake, function (error, GPCdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + " GPC data error")
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, GPCdata, function (error, GPClakeDataFlag, GPCdata) {
                        if (error) {
                          console.log(`UALL error  ${GPCdata}`);
                        }
                        if (GPClakeDataFlag) {
                          dataUpdated++;
                          processChartElevData(GPCdata, currentLake);
                        }
                      })
                    }
                  });
                  break;

                case "SJRWMD":
                  sjrwmd.getSJRWMDData(currentLake, function (error, SJRWMDdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + " SJRWMD data error")
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, SJRWMDdata, function (error, SJRWMDlakeDataFlag, SJRWMDdata) {
                        if (error) {
                          console.log(`UALL error  ${SJRWMDdata}`);
                        }
                        if (SJRWMDlakeDataFlag) {
                          dataUpdated++;
                          processChartElevData(SJRWMDdata, currentLake);
                        }
                      })
                    }
                  });
                  break;

                case "TVA":
                  tva.getTVAData(currentLake, function (error, TVAdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + " TVA data error")
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, TVAdata, function (error, TVAlakeDataFlag, TVAdata) {
                        if (error) {
                          console.log(`UALL error  ${TVAdata}`);
                        }
                        if (TVAlakeDataFlag) {
                          dataUpdated++;
                          processChartElevData(TVAdata, currentLake);
                        }
                      })
                    }
                  });
                  break;

                case "TWDB":
                  twdb.getTWDBData(currentLake, function (error, TWDBdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + " TWDB data error")
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, TWDBdata, function (error, TWDBlakeDataFlag, TWDBdata) {
                        if (error) {
                          console.log(`UALL error  ${TWDBdata}`);
                        }
                        if (TWDBlakeDataFlag) {
                          dataUpdated++;
                          processChartElevData(TWDBdata, currentLake);
                        }
                      })
                    }
                  });
                  break;

                case "LAKES":
                  uslakes.getLAKESData(currentLake, function (error, LAKESdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + " LAKES data error")
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, USLAKESdata, function (error, LAKESlakeDataFlag, LAKESdata) {
                        if (error) {
                          console.log(`UALL error  ${LAKESdata}`);
                        }
                        if (LAKESlakeDataFlag) {
                          dataUpdated++;
                          processChartElevData(LAKESdata, currentLake);
                        }
                      })
                    }
                  });
                  break;

                case "USGS":
                  usgs.getUSGSData(currentLake, function (error, USGSdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + " USGS data error")
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, USGSdata, function (error, USGSlakeDataFlag, USGSdata) {
                        if (error) {
                          console.log(`UALL error  ${USGSdata}`);
                        }
                        if (USGSlakeDataFlag) {
                          dataUpdated++;
                          processChartElevData(USGSdata, currentLake);
                        }
                      })
                    }
                  });
                  break;

                case "WEATHERWATER":
                  weatherwater.getWEATHERWATERData(currentLake, function (error, WEATHERWATERdata) {
                    if (error) {
                      globalError = true;
                      console.log(currentLake.bodyOfWater + " WEATHERWATER data error")
                    } else {
                      // if successful return the data
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, WEATHERWATERdata, function (error, WEATHERWATERlakeDataFlag, WEATHERWATERdata) {
                        if (error) {
                          console.log(`UALL error  ${WEATHERWATERdata}`);
                        }
                        if (WEATHERWATERlakeDataFlag) {
                          dataUpdated++;
                          processChartElevData(WEATHERWATERdata, currentLake);
                        }
                      })
                    }
                  });
                  break;

                default:
                  //console.log(`No data source for ${currentLake.bodyOfWater} (updateAll)`);
                  //res.send("Data source could not be found.");
              }
            }
            // Check to see if Current Conditions needs to be updated
            if (!globalError) {
              //console.log(`${currentLake.bodyOfWater} UPDATE CHECK5 Current Conditons`)
              if (update.checkForUpdate(currentLake, 1)) {
                update.updateCurrentConditionsData(currentLake);
                //console.log(`Wx called for ${currentLake.bodyOfWater}`)
              }

              // Check to see if Weather Forecast needs to be updated
              //console.log(`${currentLake.bodyOfWater} UPDATE CHECK6 Wx Forecast`)
              if (update.checkForUpdate(currentLake, 2)) {
                update.updateForecastData(currentLake);
                //console.log(`Fx called for ${currentLake.bodyOfWater}`)
              }
            }
            // log that the lake was updated and return it
            if (currentLake.data.length !== 0)
              console.log(`Update Complete for ${currentLake.bodyOfWater} (${currentLake.data[0].elev})`);
            else
              console.log(`NO Update for ${currentLake.bodyOfWater} (no data)`);


            // increment counter
            i++;

            // if counter hits the end of data reset
            if (i > data.length - 1) {
              console.log(`Report for ${Date()}`)
              console.log(`# of data updates is ${dataUpdated} of ${updateCounter} = ${((dataUpdated/updateCounter)*100).toFixed(2)}%`)

              console.log(`# of data updates is ${dataUpdated} of ${i} = ${((dataUpdated/i)*100).toFixed(2)}%`)
              totUpdateCounter = totUpdateCounter + updateCounter;
              totCounter = totCounter + i;
              totDataUpdate = totDataUpdate + dataUpdated;
              console.log(`# of total data updates is ${totDataUpdate} of ${totUpdateCounter} = ${((totDataUpdate/totUpdateCounter)*100).toFixed(2)}%`);
              console.log(`# of total updates is ${totUpdateCounter} of ${totCounter} = ${((totUpdateCounter/totCounter)*100).toFixed(2)}%`);

              // Clear counters now, this allows any late returns to get counted on the next iteration
              // SJWMD is usually slow to return data

              updateCounter = 0;
              dataUpdated = 0;
              clearInterval(timer);
              // wait for the final update to finish before resetting
              setTimeout(function () {
                ///*
                if (startServerCount > 0) {
                  //Keep Server awake
                  request("http://mysterious-plateau-86034.herokuapp.com/lakes/jordan", function (error, response, html) {

                    if (error) {
                      console.log(error);
                    } else {
                      startServerCount = 0;
                    }
                  })
                } else startServerCount++;
                //*/
                updateAllLakes();
              }, 25 * 60000);
              // wait 24 minutes (plus 5 minutes @1 second interval to cycle through 275 lakes)
              // This and the inteval below need to be adjusted when a significane # of lakes 
              // Have been added. Would like to have the interval ~30 min as possible
              // This is due to the hourly weather update mostly, but also the single level
              // instantaneous reads (like APC)
            }

          },
          // 1 second interval between launching a data fetch for the next lake
          // no less than 1 second or possibility of overrunning our weatherman.org limit of 60/min
          1.000 * 1000);
      }
    })
}

// run update function when server starts
updateAllLakes();


// The function calls below are for building the data for each of the charts on the chart tab. This data 
// processing was previously done in thisLake.js on the client side.
// moving this to the server side should provide better performance as the app grows.
function processChartElevData(data, currentLake) {
  //console.log("processChartElevData " + currentLake.bodyOfWater);
  // Building the data for the Elev charts on the back end for performance
  update.buildElevChartData(data.data, currentLake); // build data for elev chart tab (performance)
  // Building the data for the Flow charts on the back end for performance
  update.buildFlowChartData(data.data, currentLake); // build data for flow chart tab (performance)
  // Building the data for the River charts on the back end for performance
  update.buildRiverChartData(data.data, currentLake); // build data for river chart tab (performance)
  // Building the data for the flow hourly charts on the back end for performance
  update.buildHourlyFlowChartData(data.data, currentLake); // build data for hourly flow chart tab (performance)

};