const express = require("express"),
  db = require("../models")();

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
const weather = require("./updateRoutes/getWeatherData");
// Import update functions
var update = require('./updateFunctions');



// // Connect to the Mondo DB
const databaseUri = 'mongodb://localhost/BassSavvyTestDb';

if (process.env.MONGODB_URI) {
  db.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  });
  console.log("MongoDB connection successful");
} else {
  db.connect(databaseUri, {
    useNewUrlParser: true
  });
  console.log("MongoDB connection successful");
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
            if (update.checkForUpdate(currentLake)) {
              // update current lake
              // determine which data source and run function
              switch (currentLake.dataSource[0]) {

                case "ACE":
                  ace.getACEData(currentLake, function (error, ACEdata) {
                    if (error) {
                      console.log(currentLake.bodyOfWater + "- getACEData returned " + ACEdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, ACEdata, function (error, ACElakeDataFlag, ACEdata) {
                        if (error) {
                          console.log(ACEdata);
                        }
                        res.json(ACEdata);
                      })
                    }
                  });
                  break;

                case "ACEWilm":
                  acewilm.getACEWilmData(currentLake, function (error, ACEWilmdata) {
                    if (error) {
                      console.log(ACEWilmdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, ACEWilmdata, function (error, ACEWilmlakeDataFlag, ACEWilmdata) {
                        if (error) {
                          console.log(ACEWilmdata);
                        }
                        res.json(ACEWilmdata);
                      })
                    }
                  });
                  break;

                case "APC":
                  apc.getAPCData(currentLake, function (error, APCdata) {
                    if (error) {
                      console.log(APCdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, APCdata, function (error, APClakeDataFlag, APCdata) {
                        if (error) {
                          console.log(APCdata);
                        }
                        res.json(APCdata);
                      })
                    }
                  });
                  break;

                case "CUBE":
                  cube.getCUBEData(currentLake, function (error, CUBEdata) {
                    if (error) {
                      response.send(CUBEdata);
                    } else {
                      // if successful return the data
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, CUBEdata, function (error, CUBElakeDataFlag, CUBEdata) {
                        if (error) {
                          console.log(CUBEdata);
                        }
                        res.json(CUBEdata);
                      })
                    }
                  })
                  break;

                case "DE":
                  de.getDEData(currentLake, function (error, DEdata) {
                    if (error) {
                      console.log(DEdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, DEdata, function (error, DElakeDataFlag, DEdata) {
                        if (error) {
                          console.log(DEdata);
                        }
                        res.json(DEdata);
                      })
                    }
                  });
                  break;

                case "DUKE":
                  duke.getDUKEData(currentLake, function (error, DUKEdata) {
                    if (error) {
                      console.log(DUKEdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, DUKEdata, function (error, DUKElakeDataFlag, DUKEdata) {
                        if (error) {
                          console.log(DUKEdata);
                        }
                        res.json(currentLake);
                      })
                    }
                  });
                  break;

                case "GPC":
                  gpc.getGPCData(currentLake, function (error, GPCdata) {
                    if (error) {
                      console.log(GPCdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, GPCdata, function (error, GPClakeDataFlag, GPCdata) {
                        if (error) {
                          console.log(GPCdata);
                        }
                        res.json(GPCdata);
                      })
                    }
                  });
                  break;

                case "SJRWMD":
                  sjrwmd.getSJRWMDData(currentLake, function (error, SJRWMDdata) {
                    if (error) {
                      console.log(SJRWMDdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, SJRWMDdata, function (error, SJRWMDlakeDataFlag, SJRWMDdata) {
                        if (error) {
                          console.log(SJRWMDdata);
                        }
                        res.json(SJRWMDdata);
                      })
                    }
                  });
                  break;

                case "TVA":
                  tva.getTVAData(currentLake, function (error, TVAdata) {
                    if (error) {
                      console.log(TVAdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, TVAdata, function (error, TVAlakeDataFlag, TVAdata) {
                        if (error) {
                          console.log(TVAdata);
                        }
                        res.json(TVAdata);
                      })
                    }
                  });
                  break;

                case "TWDB":
                  twdb.getTWDBData(currentLake, function (error, TWDBdata) {
                    if (error) {
                      console.log(TWDBdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, TWDBdata, function (error, TWDBlakeDataFlag, TWDBdata) {
                        if (error) {
                          console.log(TWDBdata);
                        }
                        res.json(TWDBdata);
                      })
                    }
                  });
                  break;

                case "LAKES":
                  uslakes.getLAKESData(currentLake, function (error, LAKESdata) {
                    if (error) {
                      console.log(LAKESdata);
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, LAKESdata, function (error, USLAKESlakeDataFlag, LAKESdata) {
                        if (error) {
                          console.log(LAKESdata);
                        }
                        res.json(LAKESdata);
                      })
                    }
                  });
                  break;

                case "USGS":
                  usgs.getUSGSData(currentLake, function (error, USGSdata) {
                    if (error) {
                      console.log(USGSdata);
                      // if successful return the data
                    } else {
                      // update the current lake
                      update.updateAndReturnOneLake(currentLake, USGSdata, function (error, USGSlakeDataFlag, USGSdata) {
                        if (error) {
                          console.log(USGSdata);
                        }
                        res.json(USGSdata);
                      })
                    }
                  });
                  break;

                default:
                  console.log(`No data source for ${currentLake.bodyOfWater}`);
                  noLakeDataSource = true;
              }

            } else {
              // if no update is needed, send currentLake to client
              currentLake.data.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.time) - new Date(a.time);
              });
              // Need to update the current conditions and forecast for this lake since the elev data did not need an update
              // If the lake data needs updating, the weather is updated in upDateAndReturnOneLake

              // Get weather data
              // Need to add code to check refreshInterval for weatherData

              //if (checkForUpdate(currentLake.lastRefresh, currentLake.refreshInterval, currentLake.data.length)) {
              // 


              weather.getWeatherData(currentLake, function (error, lakeWeather) {
                currentLake = lakeWeather;
                if (error) {
                  console.log(`Weather retrieval error (no updata source) ${error}`)
                  res.json(currentLake);
                } else {
                  if (currentLake !== 'undefined') {
                    
                    // if no lakeData update needed, make the callback, otherwise it will be made in the switch callback
                    if (!update.checkForUpdate(currentLake)) {
                      res.json(currentLake);
                    }

                  } else {
                    console.log(`Data error for weather ${currentLake.bodyOfWater}`);
                  }
                }
              });
            }
            if (noLakeDataSource) {
              // Get weather data
              // Need to add code to check refreshInterval for weatherData

              //if (checkForUpdate(currentLake.lastRefresh, currentLake.refreshInterval, currentLake.data.length)) {
              // 


              weather.getWeatherData(currentLake, function (error, lakeWeather) {
                currentLake = lakeWeather;
                if (error) {
                  console.log(`Weather retrieval error (no data source) ${error}`)
                  //return currentLake data (likely ramps only)
                  res.json(currentLake);
                } else {
                  if (currentLake !== 'undefined') {
                   
                    //return currentLake data (ramps and weather)
                    res.json(currentLake);

                  } else {
                    console.log(`Data error for weather ${currentLake.bodyOfWater}`);
                    //return currentLake Data (likely ramps only)
                    res.json(currentLake);
                  }
                }
              });
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
          let stateLakes = data;
          res.json(stateLakes);
        }
      })
  })

  // route to retrieve all lake data from the database
  app.get("/api/find-all-lakes", function (req, res) {
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

// function to update all lakes in the database
function updateAllLakes() {
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

          //check to see if update is needed (function returns true if update is needed)
          if (update.checkForUpdate(currentLake)) {
            //console.log(`lastRefresh ${currentLake.lastRefresh} data.length ${currentLake.data.length} ${currentLake.bodyOfWater}`)
            // update current lake
            // determine which data source and run function
            //console.log(`${i+1}. Update needed for ${currentLake.bodyOfWater} (${currentLake.dataSource[0]})`);
            updateCounter++;
            switch (currentLake.dataSource[0]) {

              case "ACE":
                ace.getACEData(currentLake, function (error, ACEdata) {
                  if (error) {
                    console.log(currentLake.bodyOfWater + " ACE data error")
                    // if successful return the data
                  } else {
                    // update the current lake
                    update.updateAndReturnOneLake(currentLake, ACEdata, function (error, ACElakeDataFlag, ACEdata) {
                      if (error) {
                        console.log(ACEdata);
                      }
                      if (ACElakeDataFlag) {
                        dataUpdated++;
                        //console.log(`Updated ${currentLake.bodyOfWater}`)
                      } //else console.log(`No Update ${currentLake.bodyOfWater}`)
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
                        console.log(ACEWilmdata);
                      }
                      if (ACEWilmlakeDataFlag) {
                        dataUpdated++;
                        //console.log(`Updated ${currentLake.bodyOfWater}`)
                      } //else console.log(`No Update ${currentLake.bodyOfWater}`)
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
                        console.log(APCdata);
                      }
                      if (APClakeDataFlag) {
                        dataUpdated++;
                        //console.log(`Updated ${currentLake.bodyOfWater}`)
                      } //else console.log(`No Update ${currentLake.bodyOfWater}`)
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
                        console.log(CUBEdata);
                      }
                      if (CUBElakeDataFlag) {
                        dataUpdated++;
                        //console.log(`Updated ${currentLake.bodyOfWater}`)
                      } //else console.log(`No Update ${currentLake.bodyOfWater}`)
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
                        console.log(DUKEdata);
                      }
                      if (DElakeDataFlag) {
                        dataUpdated++;
                        //console.log(`Updated ${currentLake.bodyOfWater}`)
                      } //else console.log(`No Update ${currentLake.bodyOfWater}`)
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
                        console.log(DUKEdata);
                      }
                      if (DUKElakeDataFlag) {
                        dataUpdated++;
                        //console.log(`Updated ${currentLake.bodyOfWater}`)
                      } //else console.log(`No Update ${currentLake.bodyOfWater}`)
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
                        console.log(GPCdata);
                      }
                      if (GPClakeDataFlag) {
                        dataUpdated++;
                        //console.log(`Updated ${currentLake.bodyOfWater}`)
                      } //else console.log(`No Update ${currentLake.bodyOfWater}`)
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
                        console.log(SJRWMDdata);
                      }
                      if (SJRWMDlakeDataFlag) {
                        dataUpdated++;
                        //console.log(`Updated ${currentLake.bodyOfWater}`)
                      } //else console.log(`No Update ${currentLake.bodyOfWater}`)
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
                        console.log(TVAdata);
                      }
                      if (TVAlakeDataFlag) {
                        dataUpdated++;
                        //console.log(`Updated ${currentLake.bodyOfWater}`)
                      } //else console.log(`No Update ${currentLake.bodyOfWater}`)
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
                        console.log(TWDBdata);
                      }
                      if (TWDBlakeDataFlag) {
                        dataUpdated++;
                        //console.log(`Updated ${currentLake.bodyOfWater}`)
                      } //else console.log(`No Update ${currentLake.bodyOfWater}`)
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
                        console.log(LAKESdata);
                      }
                      if (LAKESlakeDataFlag) {
                        dataUpdated++;
                        //console.log(`Updated ${currentLake.bodyOfWater}`)
                      } //else console.log(`No Update ${currentLake.bodyOfWater}`)
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
                        console.log(USGSdata);
                      }
                      if (USGSlakeDataFlag) {
                        dataUpdated++;
                        //console.log(`Updated ${currentLake.bodyOfWater}`)
                      } //else console.log(`No Update ${currentLake.bodyOfWater}`)
                    })
                  }
                });
                break;

              default:
                //console.log(`No data source for ${currentLake.bodyOfWater}`);
                //res.send("Data source could not be found.");
            }
          }
          // if no update is needed log to console
          else {

            //  console.log(`${i}. No update needed for ${currentLake.bodyOfWater} (${currentLake.dataSource[0]})`);
          }

         

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
            console.log(`# of total updates is ${totUpdateCounter} of ${totCounter} = ${((totUpdateCounter/totCounter)*100).toFixed(2)}%`);
            console.log(`# of total data updates is ${totDataUpdate} of ${totUpdateCounter} = ${((totDataUpdate/totUpdateCounter)*100).toFixed(2)}%`);

            // Clear counters now, this allows any late returns to get counted on the next iteration
            // SJWMD is usually slow to return data

            updateCounter = 0;
            dataUpdated = 0;
            clearInterval(timer);
            // wait for the final update to finish before resetting
            setTimeout(function () {
              updateAllLakes();
            }, 24 * 60000); // wait 14 minutes (plus 27 minutes @ .5 second interval to cycle through 213 lakes)
          }

        }, .5 * 1000); // half second interval
      }
    })
}

// run update function when server starts
updateAllLakes();