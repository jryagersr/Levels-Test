const db = require("../models")();
// Import all data source update functions

const weather = require("./updateRoutes/getWeatherData");
const forecast = require("./updateRoutes/getForecastData");
var update = require('./updateFunctions');


module.exports = {

  // ===============================================================================
  // UPDATE FUNCTIONS
  // ===============================================================================

  // check to see if an update is needed (true = update is needed);
  checkForUpdate: function (currentLake, type) { // type - 0 = lake level 1 = current conditions 2 - forecast, default = 0
    let cLake = currentLake;
    let lastRefresh = cLake.lastRefresh; // to prevent re-entrant code problems
    let refreshInterval = cLake.refreshInterval; // default to lake data refresh check
    let dataLength = cLake.data.length;
    let status = false;
    console.log(`${currentLake.bodyOfWater} checkForUpdate`)

    if (type == 1) { // check current conditions weather refresh interval
      lastRefresh = cLake.ccWxDataLastRefresh; // Set to current conditions lastRefresh
      refreshInterval = 60; // current conditions are all updated every hour
      if (cLake.ccWxData == null) {
        dataLength = 0;
        console.log(`${cLake.bodyOfWater} ccWxData is null`)
      } else dataLength = cLake.ccWxData.length;
    }
    if (type == 2) { // check forecast weather refresh interval
      lastRefresh = cLake.wxForecastDataLastRefresh; // Set to forecast lastRefresh
      refreshInterval = 180; // forecat data updated every 3 hrs
      dataLength = cLake.wxForecastData.length;
    }

    // set today's date for comparison and find minute difference
    let today = new Date();
    let diffMins = 2400; // default setting to force update
    // check to make sure previous data exists
    if (dataLength > 0) {
      let msMinute = 60 * 1000;
      let msDay = 60 * 60 * 24 * 1000;
      let lastUpdate = new Date(lastRefresh);
      let diffDays = (today - lastUpdate) / msDay; // calculate diff in days
      if (diffDays > 1) {
        status = true;
      }
      diffMins = Math.round((today - lastUpdate) / 60000); // minutes
    }
    //If time for an update or the refreshInterval is corrupted
    if (diffMins >= refreshInterval || currentLake.lastRefresh == "Invalid Date") {
      status = true;
    } else {
      status = false;
    }
    return status;
  },

  // function to update and return one lake
  updateAndReturnOneLake: function (currentLake, UROLdata, callback) {

    // if new data exists, set the last Refresh time
    let updateData = UROLdata;
    let lastRefresh = currentLake.lastRefresh;
    let bodyOfWater = currentLake.bodyOfWater;
    let callbackError = false;

    lakeUpdateFlag = false;
    if (typeof updateData == "undefined") {
      console.log(`Undefined data sent to uAROL ${bodyOfWater}`);
      callbackError = true;
      callback(callbackError, lakeUpdateFlag, updateData);
    } else {
      if (updateData.length > 0) {
        if (lastRefresh !== UROLdata[0].time.toString()) {
          lakeUpdateFlag = true;
          lastRefresh = updateData[0].time.toString();
        }

        // use updateData to update the lake time elev, flow, data
        db.model("Lake").findOneAndUpdate({
            "bodyOfWater": bodyOfWater
          }, {
            $push: {
              "data": {
                $each: updateData,
                $sort: {
                  time: -1
                },
                position: 0
              }
            },
            $set: {
              "lastRefresh": lastRefresh
            }
          }, {
            upsert: true,
            useFindAndModify: false,
            new: true
          })
          .exec(function (err, updateData) {
            if (err) {
              console.log(err + "UpdateFunction .exec");
              callbackError = true;
              callback(callbackError, lakeUpdateFlag, currentLake);
            } else {

              // Check to make sure there is enough data before de-duping
              if (updateData.data.length > 1) {
                // while the first two entries still have dupes
                // loop through the data, beginning at first index
                for (var i = 1; i < updateData.data.length; i++) {
                  // check to see if there are two duplicate entrys
                  // convert timestamps to strings to avoid millisecond differences
                  if (updateData.data[i].time.toString().substring(0, 25) == updateData.data[i - 1].time.toString().substring(0, 25)) {
                    // remove the oldest entry or a zero average level (not sure how a zero got into the data
                    // based on the the getDUKEData code, but it did for all but two of the Duke lakes.)
                    if (updateData.data[i].flow == "Missing") {
                      updateData.data.splice(i, 1);
                    } else {
                      updateData.data.splice(i - 1, 1);
                    }
                    i--;
                  }
                }
              }
              // update the database with the 'clean' data
              db.model("Lake").updateOne({
                  'bodyOfWater': bodyOfWater
                }, {
                  $set: {
                    "data": updateData.data
                  }
                })
                .exec(function (err) {
                  if (err) {
                    console.log(error);
                  } else {

                    callbackError = false;
                    callback(callbackError, lakeUpdateFlag, updateData);

                  }
                })
            }
          });

      }
    }
  },



  // function to update and return one lake
  updateCurrentConditionsData: function (currentLake) {
    let ccLake = currentLake
    let bodyOfWater = ccLake.bodyOfWater;

    // Update the current conditions and forecast for this lake

    // Get weather data
    weather.getWeatherData(currentLake, function (error, data) {
      let newLakeCC = data;
      if (error) {
        console.log(`Weather retrieval error (updateFunction) ${currentLake.bodyOfWater}`)
        callbackError = true;
        console.log(`Forecast Data for ${bodyOfWater} failed`)
        return false;
      } else {
        if (newLakeCC !== 'undefined') {
          weatherData = true;

        } else {
          console.log(`Data error for weather ${bodyOfWater}`);
        }

        // if there are 48 in ccWxData, pop one off

        // push the current conditions into ccWxData[] and update the LastRefresh
        let timeStamp = newLakeCC.ccWxDataLastRefresh;

        processChartWxData(currentLake, currentLake);

        db.model("Lake").updateOne({
            'bodyOfWater': bodyOfWater
          }, {
            $set: {
              "ccWxData": newLakeCC.ccWxData,

              "ccWxDataLastRefresh": timeStamp
            }
          })
          .exec(function (err, ccWxData) {
            if (err) {
              console.log(err);
            } else {
              return true;
            }
          });
        }

    })
  },

  // function to update forecast data
  updateForecastData: function (currentLake) {

    // Get weather forecast data

    forecast.getForecastData(currentLake, function (error, lakeForecast) {
      let forecastLake = lakeForecast;
      //let fxData = [];
      let bodyOfWater = forecastLake.bodyOfWater;
      if (error) {
        console.log(`Weather retrieval error (updateFunction) ${error}`)
        callbackError = true;
      } else {

        if (forecastLake !== 'undefined') {
          currentLake = forecastLake;

        } // push the current conditions into wxForecastData[] and update the LastRefresh
        let timeStamp = currentLake.wxForecastDataLastRefresh;

        db.model("Lake").updateOne({
            'bodyOfWater': bodyOfWater
          }, {
            $set: {
              "wxForecastData": currentLake.wxForecastData,

              "wxForecastDataLastRefresh": timeStamp
            }
          })
          .exec(function (err, wxForecastData) {
            if (err) {
              console.log(err);
            }
          });

      }
    });

  },


/******************************************************************************************************************/
// Function to build data for Elev on page
// Moved to server side for performance
/******************************************************************************************************************/
// Function to prepare chart data
buildElevChartData: function (data, lake) {
  // Our data must be parsed into separate flat arrays for the chart
  var elevData = data;
  let chartElevObject = {
    type: "Elev",
    dataNPBatch: [],
    dataFCBatch: [],
    labelBatch: [],
    dataElevBatch: [],
    chartMinElevLimit: 10000,
    chartMaxElevLimit: 0
  }

  let sumOfElevs = 0;
  let divisor = 0;
  let k = 0; // our iterator after starting elevation
  let checkDate = new Date(elevData[0].time).toLocaleDateString();
  checkDate = checkDate.substr(0, checkDate.length - 5, );



  // Loop through our data for 24 data points if we have it
  for (k = 0; k < elevData.length; k++) {

    checkDateIsValid = new Date(elevData[k].time).toLocaleDateString();

    if (checkDateIsValid !== 'Invalid Date') {

      let timestamp = new Date(elevData[k].time);
      entryDate = timestamp.toLocaleDateString();

      //remove year from date
      entryDate = entryDate.substr(0, entryDate.length - 5, );



      // if we're still on the same day and not on the last entry
      if (entryDate === checkDate) {

        // add to our average variables
        sumOfElevs += Number(elevData[k].elev);
        divisor++
      } else {

        // push data and reset averages
        if ((sumOfElevs / divisor) > chartElevObject.chartMaxElevLimit) // if value is greater than max, replace max
          chartElevObject.chartMaxElevLimit = sumOfElevs / divisor; // update Max Elev average
        if ((sumOfElevs / divisor) < chartElevObject.chartMinElevLimit) // if value is less thank min, replace min
          chartElevObject.chartMinElevLimit = sumOfElevs / divisor; // update Min Elev average
        chartElevObject.labelBatch.push(elevData[k-1].time);
        chartElevObject.dataElevBatch.push((sumOfElevs / divisor).toFixed(2)); // calculate average
        chartElevObject.dataNPBatch.push(lake.normalPool); // Normal Pool line batch 
        chartElevObject.dataFCBatch.push(lake.topOfFloodControl); // Top of Flood Control Pool line batch
        //dataTDBatch.push(lake.topOfDam); // Top of Dam line batch

        sumOfElevs = Number(elevData[k].elev);
        divisor = 1;
        checkDate = entryDate;
      }

    } else {
      if (k < elevData.length - 1) {
        checkDate = new Date(elevData[k + 1].time).toLocaleDateString();
        checkDate = checkDate.substr(0, checkDate.length - 5, );
      }
    }
    // when a week of data has been reached stop
    if (chartElevObject.labelBatch.length > 13) {
      break;
    }
  }

  //push the final day's values after looping
  chartElevObject.labelBatch.push(elevData[k-1].time); // put final day date value in array
  chartElevObject.dataElevBatch.push((sumOfElevs / divisor).toFixed(2)); // calculate average final day and push
  chartElevObject.dataNPBatch.push(lake.normalPool); // Normal Pool line batch 
  chartElevObject.dataFCBatch.push(lake.topOfFloodControl); // Normal Pool line batch 
  //dataTDBatch.push(lake.topOfDam); // Top of Dam line batch 

  //check the final day's values for Min and MaxLimit
  if ((sumOfElevs / divisor) >= chartElevObject.chartMaxElevLimit) // if value is greater than max, replace max
    chartElevObject.chartMaxElevLimit = Math.ceil(sumOfElevs / divisor); // update Max Elev average
  if ((sumOfElevs / divisor) <= chartElevObject.chartMinElevLimit) // if value is less thank min, replace min
    chartElevObject.chartMinElevLimit = Math.floor(sumOfElevs / divisor); // update Min Elev average

  if (lake.normalPool < chartElevObject.chartMinElevLimit)
    chartElevObject.chartMinElevLimit = lake.normalPool;

  //if (lake.normalPool > chartMaxElev)
  //chartMaxElev = lake.normalPool;

  chartElevObject.labelBatch.reverse();
  chartElevObject.dataElevBatch.reverse();

  // need to check to see if there is already elev data in chartData field, if there is, just update it
  // otherwise create it.
  let elevExists = false;
  let elevIndex = 0;
  for (i = 0; i < lake.chartData.length; i++) {

    if (lake.chartData[i].type == "Elev") {
      elevExists = true;
      elevIndex = i;
      break;
    }
  };
  if (elevExists) { // update the data in the current chartData
    lake.chartData[elevIndex].dataNPBatch = chartElevObject.dataNPBatch;
    lake.chartData[elevIndex].dataFCBatch = chartElevObject.dataFCBatch;
    lake.chartData[elevIndex].labelBatch = chartElevObject.labelBatch;
    lake.chartData[elevIndex].dataElevBatch = chartElevObject.dataElevBatch;
    lake.chartData[elevIndex].chartMinElevLimit = chartElevObject.chartMinElevLimit;
    lake.chartData[elevIndex].chartMaxElevLimit = chartElevObject.chartMaxElevLimit;
  } else
    lake.chartData.push(chartElevObject);

  // update the database with the 'Elev' data
  db.model("Lake").updateOne({
      'bodyOfWater': lake.bodyOfWater
    }, {
      $set: {
        "chartData": lake.chartData
      }
    })
    .exec(function (err) {
      if (err)
        console.log(error);

    })
},


/******************************************************************************************************************/
// Function to build data for Elev on page
// Moved to server side for performance
/******************************************************************************************************************/
// Function to prepare chart data
/******************************************************************************************************************/
// Function to build daily flow chart data
buildFlowChartData: function (data, lake) {

  let chartFlowObject = {
    type: "Flow",
    labelBatch: [],
    dataFlowBatch: [],
    chartMinFlowLimit: 0, // y-axis Min Flow value
    chartMaxFlowLimit: 0 // y-axis Max Flow value

  }

  // Our data must be parsed into separate flat arrays for the chart
  let sumOfFlows = 0;
  let divisor = 0;
  let k = 0; // our iterator after starting flow
  let avgFlow = 0;
  let checkDate = new Date(data[0].time).toLocaleDateString();

  checkDate = checkDate.substr(0, checkDate.length - 5, );

  // Loop through our data for 24 data points if we have it
  for (k = 0; k < data.length; k++) {


    if (data[k].flow == "Missing" || data[k].flow < 0) {
      //console.log("Missing Flow - " + lake.bodyOfWater)
      data[k].flow = -1;
    }
      sumOfFlows += data[k].flow
      divisor++

    
    let currentDate = new Date(data[k].time).toLocaleDateString();
    currentDate = currentDate.substr(0, currentDate.length - 5, )

    if (currentDate !== checkDate) {
      avgFlow = Number((sumOfFlows / divisor).toFixed(2))
      chartFlowObject.labelBatch.push(data[k-1].time);
      chartFlowObject.dataFlowBatch.push(avgFlow);
      sumOfFlows = 0;
      divisor = 0;
      checkDate = new Date(data[k].time).toLocaleDateString();
      checkDate = checkDate.substr(0, checkDate.length - 5, );

      if (avgFlow >= chartFlowObject.chartMaxFlowLimit) // if value is greater than max, replace max
        chartFlowObject.chartMaxFlowLimit = avgFlow; // flow for calculating Chart y-axis Max later

    }

    // when a week of data has been reached stop
    if (chartFlowObject.labelBatch.length > 13) {
      break;
    }

  }

  //check the final day's values for Min and MaxLimit
  //if ((sumOfFlows / divisor) <= chartMinFlow)
  //chartMinFlow = (sumOfFlows / divisor);
  if ((sumOfFlows / divisor) >= chartFlowObject.chartMaxFlowLimit)
    chartFlowObject.chartMaxFlowLimit = Number((sumOfFlows / divisor).toFixed(2));;

  chartFlowObject.labelBatch.reverse();
  chartFlowObject.dataFlowBatch.reverse();

  // Set y axis limits for Flow Chart
  chartFlowObject.chartMinFlowLimit = 0; // set lower chart limit
  chartFlowObject.chartMaxFlowLimit = Math.round(((((chartFlowObject.chartMaxFlowLimit - (chartFlowObject.chartMaxFlowLimit % 1000)) / 1000) * 1.25) * 1000) / 1000) * 1000; // set the chart upper limit

  //if (chartMinFlowLimit < 1000) chartMinFlowLimit = 0; // Flow Min limit should just be set to 0

  if (chartFlowObject.chartMaxFlowLimit < 4000)
    chartFlowObject.chartMaxFlowLimit = (Math.ceil(chartFlowObject.chartMaxFlowLimit / 1000) * 1000) + 1000;


  // need to check to see if there is already flow data in chartData field, if there is, just update it
  // otherwise create it.
  let flowExists = false;
  let flowIndex = 0;
  for (i = 0; i < lake.chartData.length; i++) {

    if (lake.chartData[i].type == "Flow") {
      flowExists = true;
      flowIndex = i;
      break;
    }
  };
  if (flowExists) { // update the data in the current chartData
    lake.chartData[flowIndex].labelBatch = chartFlowObject.labelBatch;
    lake.chartData[flowIndex].dataFlowBatch = chartFlowObject.dataFlowBatch;
    lake.chartData[flowIndex].chartMinFlowLimit = chartFlowObject.chartMinFlowLimit;
    lake.chartData[flowIndex].chartMaxFlowLimit = chartFlowObject.chartMaxFlowLimit;
  } else
    lake.chartData.push(chartFlowObject);

  // update the database with the 'Elev' data
  db.model("Lake").updateOne({
      'bodyOfWater': lake.bodyOfWater
    }, {
      $set: {
        "chartData": lake.chartData
      }
    })
    .exec(function (err) {
      if (err)
        console.log(error);

    })
},


/******************************************************************************************************************/
// Function to build chart data
// Actually Hourly Elevation but called River because it can show daily tides on a River
buildRiverChartData: function (data, lake) {

  let chartRiverObject = {
    type: "River",
    labelBatch: [],
    dataRiverBatch: [],
    chartMinRiverLimit: 10000, // y-axis Min Flow value
    chartMaxRiverLimit: -200, // y-axis Max Flow value
    minMaxDiff: 0

  }

  // Our data must be parsed into separate flat arrays for the chart
  let k = 0; // our iterator after starting elevation
  let hourlyElev = 0;


  // Loop through our data for 48 data points if we have it
  // two days worth of data may show the tides in tidal rivers 
  for (k = 0; k < data.length; k++) {

    // Set hourlyElev
    /*if (k < 2)
      hourlyElev = Number((data[k - 1].elev + data[k].elev) / 2);
    else
      hourlyElev = Number((data[k - 2].elev + data[k - 1].elev + data[k].elev) / 3);*/


    chartRiverObject.labelBatch.push(data[k].time);
    chartRiverObject.dataRiverBatch.push(parseFloat(Number(data[k].elev).toFixed(2))); // push elev

    // need the parseFloat for comparing negative numbers. 
    if (parseFloat(Number(data[k].elev).toFixed(2)) > parseFloat(chartRiverObject.chartMaxRiverLimit)) // if value is greater than max, replace max
      chartRiverObject.chartMaxRiverLimit = parseFloat(Number(data[k].elev).toFixed(2)); // update Max Elev average
    if (parseFloat(Number(data[k].elev).toFixed(2)) < parseFloat(chartRiverObject.chartMinRiverLimit)) // if value is less thank min, replace min
      chartRiverObject.chartMinRiverLimit = parseFloat(Number(data[k].elev).toFixed(2)); // update Min Elev average


    // when a week of data has been reached stop
    if (chartRiverObject.labelBatch.length > 47) {
      break;
    }
  }

  chartRiverObject.labelBatch.reverse();
  chartRiverObject.dataRiverBatch.reverse();

  // Set axis limits for River Chart
  chartRiverObject.minMaxDiff = Number((chartRiverObject.chartMaxRiverLimit - chartRiverObject.chartMinRiverLimit).toFixed(2));
  let chartGap = Number(chartRiverObject.minMaxDiff);

  if (chartRiverObject.minMaxDiff > 20)
    chartGap = Number((chartRiverObject.minMaxDiff * .1).toFixed(0));
  if (chartGap < 1)
    chartGap = .05;

  chartRiverObject.chartMaxRiverLimit = Math.ceil((Number(chartRiverObject.chartMaxRiverLimit) + chartGap) * 10) / 10; // set the chart upper limit

  chartRiverObject.chartMinRiverLimit = Math.floor((Number(chartRiverObject.chartMinRiverLimit) - chartGap) * 10) / 10; // set the chart lower limit



  // need to check to see if there is already flow data in chartData field, if there is, just update it
  // otherwise create it.
  let riverExists = false;
  let riverIndex = 0;
  for (i = 0; i < lake.chartData.length; i++) {

    if (lake.chartData[i].type == "River") {
      riverExists = true;
      riverIndex = i;
      break;
    }
  };
  if (riverExists) { // update the data in the current chartData
    lake.chartData[riverIndex].labelBatch = chartRiverObject.labelBatch;
    lake.chartData[riverIndex].dataRiverBatch = chartRiverObject.dataRiverBatch;
    lake.chartData[riverIndex].chartMinRiverLimit = chartRiverObject.chartMinRiverLimit;
    lake.chartData[riverIndex].chartMaxRiverLimit = chartRiverObject.chartMaxRiverLimit;
  } else
    lake.chartData.push(chartRiverObject);

  // update the database with the 'Elev' data
  db.model("Lake").updateOne({
      'bodyOfWater': lake.bodyOfWater
    }, {
      $set: {
        "chartData": lake.chartData
      }
    })
    .exec(function (err) {
      if (err)
        console.log(error);

    })
},


/******************************************************************************************************************/
// Function to build hourly chart data
buildHourlyFlowChartData: function (data, lake) {
  // Our data must be parsed into separate flat arrays for the chart

  let chartFlowHourlyObject = {
    type: "FlowHourly",
    labelBatch: [],
    dataFlowHourlyBatch: [],
    chartMinFlowHourlyLimit: 100000000, // y-axis Min Flow value
    chartMaxFlowHourlyLimit: 0, // y-axis Max Flow value
    chartGap: 0
  }

  let k = 0; // our iterator after starting elevation

  // Loop through our data for 24 data points if we have it
  for (k = 0; k < data.length; k++) {

    // if we're past the first entry
    //if (k > 0) {
    chartFlowHourlyObject.labelBatch.push(data[k].time); // Remove minutes
    let dataFlow = data[k].flow;
    if (dataFlow !== "Missing" && dataFlow !== "N/A" && data.refreshInterval !== 180) {
      if (dataFlow == '' || dataFlow == 'N/A') {
        chartFlowHourlyObject.dataFlowHourlyBatch.push(-99);
        //dataFlow = 0;
      }
      else
        chartFlowHourlyObject.dataFlowHourlyBatch.push((Number(data[k].flow)).toFixed(0)); // push elev

      if (dataFlow > chartFlowHourlyObject.chartMaxFlowHourlyLimit) // if value is greater than max, replace max
        chartFlowHourlyObject.chartMaxFlowHourlyLimit = dataFlow; // update Max Elev average
      if (dataFlow < chartFlowHourlyObject.chartMinFlowHourlyLimit) // if value is less thank min, replace min
        chartFlowHourlyObject.chartMinFlowHourlyLimit = dataFlow; // update Min Elev average

    } else chartFlowHourlyObject.dataFlowHourlyBatch.push(-99); // push elev
    //}

    // when a week of data has been reached stop
    if (chartFlowHourlyObject.labelBatch.length > 47) {
      break;
    }
  }

  chartFlowHourlyObject.labelBatch.reverse();
  chartFlowHourlyObject.dataFlowHourlyBatch.reverse();

  // Set y axis limits for hourly Flow Chart
  chartFlowHourlyObject.chartGap = chartFlowHourlyObject.chartMaxFlowHourlyLimit / 5;
  chartFlowHourlyObject.chartGap = Math.ceil((chartFlowHourlyObject.chartGap / 1000).toFixed(0)) * 1000;
  //let minMaxDiff = chartMaxFlow - chartMinFlow;
  //if (minMaxDiff < 1 && minMaxDiff !== 0) chartGap = minMaxDiff * 2;
  //chartFlowHourlyObject.chartMinFlowHourlyLimit = 0; // set the chart lower limit
  chartFlowHourlyObject.chartMaxFlowHourlyLimit = ((Math.ceil(chartFlowHourlyObject.chartMaxFlowHourlyLimit / 1000) * 1000) + Math.round(chartFlowHourlyObject.chartGap)); // set the chart upper limit


  // need to check to see if there is already flow data in chartData field, if there is, just update it
  // otherwise create it.
  let flowHourlyExists = false;
  let flowHourlyIndex = 0;
  for (i = 0; i < lake.chartData.length; i++) {

    if (lake.chartData[i].type == "FlowHourly") {
      flowHourlyExists = true;
      flowHourlyIndex = i;
      break;
    }
  };
  if (flowHourlyExists) { // update the data in the current chartData
    lake.chartData[flowHourlyIndex].labelBatch = chartFlowHourlyObject.labelBatch;
    lake.chartData[flowHourlyIndex].dataFlowHourlyBatch = chartFlowHourlyObject.dataFlowHourlyBatch;
    lake.chartData[flowHourlyIndex].chartMinFlowHourlyLimit = chartFlowHourlyObject.chartMinFlowHourlyLimit;
    lake.chartData[flowHourlyIndex].chartMaxFlowHourlyLimit = chartFlowHourlyObject.chartMaxFlowHourlyLimit;
  } else
    lake.chartData.push(chartFlowHourlyObject);

  // update the database with the 'Elev' data
  db.model("Lake").updateOne({
      'bodyOfWater': lake.bodyOfWater
    }, {
      $set: {
        "chartData": lake.chartData
      }
    })
    .exec(function (err) {
      if (err)
        console.log(error);

    })

}
};

/******************************************************************************************************************/
// Function to build temp chart data
function buildTempChartData(tempData, lake) {
  // Our data must be parsed into separate flat arrays for the chart


  let chartTempObject = {
    type: "Temp",
    labelBatch: [],
    dataTempBatch: [],
    dewPointBatch: [],
    feelsLikeBatch: [],
    chartMinTempLimit: 100, // y-axis Min Flow value
    chartMaxTempLimit: 0, // y-axis Max Flow value
    minMaxDiff: 0
  }

  let k = 0; // our iterator after starting Temp

  // Loop through our data for 48 data points if we have it
  for (k; k < tempData.length; k++) {
    if (typeof tempData[k].temp == "number") {

      //calculate the time as 12 hour AM PM.
      let timeStamp = new Date(tempData[k].date);

      // Calculate Dewpoint (Tdp = Tf - 9/25(100-RH))
      let dewPoint = tempData[k].temp - (.36 * (100 - tempData[k].humidity));

      chartTempObject.feelsLikeBatch.push(tempData[k].feelslike);
      chartTempObject.dewPointBatch.push(dewPoint); // push dew point
      //labelBatch.push(hour + suffix); // push time
      chartTempObject.labelBatch.push(new Date(tempData[k].date).toUTCString()); // push time
      chartTempObject.dataTempBatch.push(tempData[k].temp); // push Temp

      if (tempData[k].temp > chartTempObject.chartMaxTempLimit) // if temp value is greater than max, replace max
        chartTempObject.chartMaxTempLimit = tempData[k].temp; // update Max Temp average

      if (tempData[k].feelslike > chartTempObject.chartMaxTempLimit) // if feelslike value is greater than max, replace max
        chartTempObject.chartMaxTempLimit = tempData[k].feelslike; // update Max Temp average

      if (tempData[k].temp < chartTempObject.chartMinTempLimit) // if temp value is less than min, replace min
        chartTempObject.chartMinTempLimit = tempData[k].temp; // update Min Temp average

      if (tempData[k].feelslike < chartTempObject.chartMinTempLimit) // if feelslike value is less than min, replace min
        chartTempObject.chartMinTempLimit = tempData[k].feelslike; // update Min Temp average

      //if (dewPoint < chartMinTemp) // if value is less thank min, replace min
      //chartMinTemp = dewPoint; // update Min Temp average

    }

    // when two days of data has been reached stop
    if (chartTempObject.labelBatch.length > 47 || k > tempData.length - 1) {
      break;
    }
  }

  // Set y axis limits for Temp Chart
  chartTempObject.minMaxDiff = chartTempObject.chartMaxTempLimit - chartTempObject.chartMinTempLimit;
  if (chartTempObject.minMaxDiff < 1) chartGap = chartTempObject.minMaxDiff / 2;
  chartTempObject.chartMinTempLimit = Math.floor(chartTempObject.chartMinTempLimit) - 1; // set the chart lower limit 2' below min
  chartTempObject.chartMaxTempLimit = Math.ceil(chartTempObject.chartMaxTempLimit) + 1; // set the chart upper limit 2' below max


  // Need to check to see if there is already flow data in chartData field, if there is, just update it
  // otherwise create it.
  let tempExists = false;
  let tempIndex = 0;
  for (i = 0; i < lake.chartData.length; i++) {

    if (lake.chartData[i].type == "Temp") {
      tempExists = true;
      tempIndex = i;
      break;
    }
  };
  if (tempExists) { // update the data in the current chartData
    lake.chartData[tempIndex].labelBatch = chartTempObject.labelBatch;
    lake.chartData[tempIndex].dataTempBatch = chartTempObject.dataTempBatch;
    lake.chartData[tempIndex].feelsLikeBatch = chartTempObject.feelsLikeBatch;
    lake.chartData[tempIndex].chartMinTempLimit = chartTempObject.chartMinTempLimit;
    lake.chartData[tempIndex].chartMaxTempLimit = chartTempObject.chartMaxTempLimit;
    lake.chartData[tempIndex].chartMinMaxDiff = chartTempObject.minMaxDiff
  } else
    lake.chartData.push(chartTempObject);

  // update the database with the 'Elev' data
  db.model("Lake").updateOne({
      'bodyOfWater': lake.bodyOfWater
    }, {
      $set: {
        "chartData": lake.chartData
      }
    })
    .exec(function (err) {
      if (err)
        console.log(error);

    })
};


/******************************************************************************************************************/
// Function to build baro chart data
 function buildBaroChartData(baroData, lake) {
  // Our data must be parsed into separate flat arrays for the chart

  let chartBaroObject = {
    type: "Baro",
    labelBatch: [],
    dataBaroBatch: [],
    chartMinBaroLimit: 35, // y-axis Min Flow value
    chartMaxBaroLimit: 0, // y-axis Max Flow value
    chartGap: 0
  }

  let k = 0; // our iterator after starting elevation

  // Loop through our data for 48 data points if we have it
  for (k; k < baroData.length; k++) {

    if (typeof baroData[k].baro == "number") {

      let timeStamp = new Date(baroData[k].date);

      // Convert millibars to inches
      let currentBaro = parseFloat(baroData[k].baro * 0.0295301);

      chartBaroObject.labelBatch.push(new Date(baroData[k].date).toUTCString()); // push time
      //labelBatch.push(hour + suffix);
      chartBaroObject.dataBaroBatch.push(baroData[k].baro * 0.0295301); // push elev convert to inches

      if (currentBaro > chartBaroObject.chartMaxBaroLimit) // if value is greater than max, replace max
        chartBaroObject.chartMaxBaroLimit = currentBaro; // update Max Elev average
      if (currentBaro < chartBaroObject.chartMinBaroLimit) // if value is less thank min, replace min
        chartBaroObject.chartMinBaroLimit = currentBaro; // update Min Elev average

    }

    // when 2 days of data has been reached stop
    if (chartBaroObject.labelBatch.length > 47 || k > baroData.length - 1) {
      break;
    }
  }

  // Set y axis limits for Baro Chart
  //let minMaxDiff = chartMaxBaro - chartMinBaro;
  //if (minMaxDiff < 1) chartGap = minMaxDiff / 2;
  chartBaroObject.chartMinBaroLimit = Math.floor(chartBaroObject.chartMinBaroLimit * 10) / 10 - 0.1; // set the chart lower limit
  chartBaroObject.chartMaxBaroLimit = Math.ceil(chartBaroObject.chartMaxBaroLimit * 10) / 10 + 0.1; // set the chart upper limit


  // need to check to see if there is already flow data in chartData field, if there is, just update it
  // otherwise create it.
  let baroExists = false;
  let baroIndex = 0;
  for (i = 0; i < lake.chartData.length; i++) {

    if (lake.chartData[i].type == "Baro") {
      baroExists = true;
      baroIndex = i;
      break;
    }
  };
  if (baroExists) { // update the data in the current chartData
    lake.chartData[baroIndex].labelBatch = chartBaroObject.labelBatch;
    lake.chartData[baroIndex].dataBaroBatch = chartBaroObject.dataBaroBatch;
    lake.chartData[baroIndex].chartMinBaroLimit = chartBaroObject.chartMinBaroLimit;
    lake.chartData[baroIndex].chartMaxBaroLimit = chartBaroObject.chartMaxBaroLimit;
  } else
    lake.chartData.push(chartBaroObject);

  // update the database with the 'Elev' data
  db.model("Lake").updateOne({
      'bodyOfWater': lake.bodyOfWater
    }, {
      $set: {
        "chartData": lake.chartData
      }
    })
    .exec(function (err) {
      if (err)
        console.log(error);

    })

};

/******************************************************************************************************************/
// Function to build Wind Speed chart data
function buildWindChartData(windData, lake) {
  // Our data must be parsed into separate flat arrays for the chart

  let chartWindObject = {
    type: "Wind",
    labelBatch: [],
    dataWindBatch: [],
    chartMinWindLimit: 35, // y-axis Min Flow value
    chartMaxWindLimit: 0, // y-axis Max Flow value
  }

  let k = 0; // our iterator after starting wind speed

  // Loop through our data for 48 data points if we have it
  for (k; k < windData.length; k++) {

    if (typeof windData[k].windspeed == "number") {


      chartWindObject.labelBatch.push(new Date(windData[k].date).toUTCString()); // push time
      //labelBatch.push(hour + suffix);
      chartWindObject.dataWindBatch.push(windData[k].windspeed); // push wind speeed

      if (windData[k].windspeed > chartWindObject.chartMaxWindLimit) // if value is greater than max, replace max
        chartWindObject.chartMaxWindLimit = windData[k].windspeed; // update Max Wind
      if (windData[k].windspeed < chartWindObject.chartMinWindLimit) // if value is less thank min, replace min
        chartWindObject.chartMinWindLimit = windData[k].windspeed; // update Min Wind

    };

    // when 2 days of data has been reached stop
    if (chartWindObject.labelBatch.length > 47 || k > windData.length - 2) {
      break;
    };
  };

  // Set y axis limits for Baro Chart
  let chartGap = chartWindObject.chartMaxWindLimit * .2;
  let minMaxDiff = chartWindObject.chartMaxWindLimit - chartWindObject.chartMinWindLimit;
  if (minMaxDiff < 1) chartGap = minMaxDiff / 2;
  chartWindObject.chartMinWindLimit = 0; // set the chart lower limit
  chartWindObject.chartMaxWindLimit = Math.ceil(chartWindObject.chartMaxWindLimit) + Math.ceil(chartGap); // set the chart upper limit


  // need to check to see if there is already flow data in chartData field, if there is, just update it
  // otherwise create it.
  let windExists = false;
  let windIndex = 0;
  for (i = 0; i < lake.chartData.length; i++) {

    if (lake.chartData[i].type == "Wind") {
      windExists = true;
      windIndex = i;
      break;
    }
  };
  if (windExists) { // update the data in the current chartData
    lake.chartData[windIndex].labelBatch = chartWindObject.labelBatch;
    lake.chartData[windIndex].dataWindBatch = chartWindObject.dataWindBatch;
    lake.chartData[windIndex].chartMinWindLimit = chartWindObject.chartMinWindLimit;
    lake.chartData[windIndex].chartMaxWindLimit = chartWindObject.chartMaxWindLimit;
  } else
    lake.chartData.push(chartWindObject);

  // update the database with the 'Elev' data
  db.model("Lake").updateOne({
      'bodyOfWater': lake.bodyOfWater
    }, {
      $set: {
        "chartData": lake.chartData
      }
    })
    .exec(function (err) {
      if (err)
        console.log(error);

    })
};


/******************************************************************************************************************/
// Function to build humidity chart data
function buildHumidityChartData(humidityData, lake) {


  let chartHumidityObject = {
    type: "Humidity",
    labelBatch: [],
    dataHumidityBatch: [],
    chartMinHumidityLimit: 101, // y-axis Min Flow value
    chartMaxHumidityLimit: 0, // y-axis Max Flow value
    minMaxDiff: 0
  }

  // Our data must be parsed into separate flat arrays for the chart
  let k = 0; // our iterator after starting elevation

  // Loop through our data for 48 data points if we have it
  for (k; k < humidityData.length; k++) {

    if (typeof humidityData[k].humidity == "number") { //calculate the time as 12 hour AM PM.

      let timeStamp = new Date(humidityData[k].date);

      //calculate the time as 12 hour AM PM.
      hour = timeStamp.getHours();
      let suffix = "PM";
      if (hour < 12)
        suffix = "AM";
      hour = ((hour + 11) % 12 + 1);

      //labelBatch.push(hour + suffix)
      chartHumidityObject.labelBatch.push(new Date(humidityData[k].date).toUTCString()); // push time
      chartHumidityObject.dataHumidityBatch.push(humidityData[k].humidity); // push elev

      if (chartHumidityObject.chartMaxHumidityLimit < humidityData[k].humidity)
        chartHumidityObject.chartMaxHumidityLimit = humidityData[k].humidity

      if (chartHumidityObject.chartMinHumidityLimit > humidityData[k].humidity)
        chartHumidityObject.chartMinHumidityLimit = humidityData[k].humidity

    }

    // when 2 days of data has been reached stop
    if (chartHumidityObject.labelBatch.length > 47 || k > humidityData.length - 1) {
      break;
    }
  }

  //chartHumidityObject.labelBatch.reverse();
  //chartHumidityObject.dataHumidityBatch.reverse();

  // Set axis limits for Humidity Chart
  chartHumidityObject.chartMinHumidityLimit = chartHumidityObject.chartMinHumidityLimit - 10; // set the chart lower limit
  chartHumidityObject.chartMaxHumidityLimit = chartHumidityObject.chartMaxHumidityLimit + 10; // set the chart upper limit


  // need to check to see if there is already flow data in chartData field, if there is, just update it
  // otherwise create it.
  let humidityExists = false;
  let humidityIndex = 0;
  for (i = 0; i < lake.chartData.length; i++) {

    if (lake.chartData[i].type == "Humidity") {
      humidityExists = true;
      humidityIndex = i;
      break;
    }
  };
  if (humidityExists) { // update the data in the current chartData
    lake.chartData[humidityIndex].labelBatch = chartHumidityObject.labelBatch;
    lake.chartData[humidityIndex].dataHumidityBatch = chartHumidityObject.dataHumidityBatch;
    lake.chartData[humidityIndex].chartMinHumidityLimit = chartHumidityObject.chartMinHumidityLimit;
    lake.chartData[humidityIndex].chartMaxHumidityLimit = chartHumidityObject.chartMaxHumidityLimit;
  } else
    lake.chartData.push(chartHumidityObject);

  // update the database with the 'Elev' data
  db.model("Lake").updateOne({
      'bodyOfWater': lake.bodyOfWater
    }, {
      $set: {
        "chartData": lake.chartData
      }
    })
    .exec(function (err) {
      if (err)
        console.log(error);

    })
  };

/******************************************************************************************************************/
// Function to build wind direction chart data
function buildWindDirectionChartData(windData, lake) {

  let chartWindDirectionObject = {
    type: "WindDirection",
    labelBatch: [],
    dataWindDirectionBatch: [],
    chartMinWindDirectionLimit: 35, // y-axis Min Flow value
    chartMaxWinDirectionLimit: 0, // y-axis Max Flow value
    displayCompassSector: ["N", " ", "NE", " ", "E", " ", "SE", " ", "S", " ", "SW", " ", "W", " ", "NW", " "]
  }

  // Our data must be parsed into separate flat arrays for the chart
  let windDirectionsIndex = 0;
  let k = 0; // our iterator after starting data
  let compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  let displayCompassSector = ["N", " ", "NE", " ", "E", " ", "SE", " ", "S", " ", "SW", " ", "W", " ", "NW", " "];
  chartWindDirectionObject.displayCompassSector.push(displayCompassSector);
  // Loop through our data for 48 data points if we have it
  for (k; k < windData.length; k++) {

    if (typeof windData[k].winddirection == "string") {


      chartWindDirectionObject.labelBatch.push(new Date(windData[k].date).toUTCString()); // push time
      //labelBatch.push(hour + suffix);

      // check to see if wind direction reported is null
      if (windData[k].winddirection == null) {
        windDirection = 0;

      } else {
        windDirectionsIndex = compassSector.indexOf(windData[k].winddirection);
      };
      chartWindDirectionObject.dataWindDirectionBatch.push(windDirectionsIndex); // push wind direction

    };

    // when 2 days of data has been reached stop
    if (chartWindDirectionObject.labelBatch.length > 47 || k > windData.length - 2) {
      break;
    };
  };

  //console.log (lake.bodyOfWater + " Wind Direction")



  // need to check to see if there is already flow data in chartData field, if there is, just update it
  // otherwise create it.
  let windDirectionExists = false;
  let windDirectionIndex = 0;
  for (i = 0; i < lake.chartData.length; i++) {

    if (lake.chartData[i].type == "WindDirection") {
      windDirectionExists = true;
      windDirectionIndex = i;
      break;
    }
  };
  if (windDirectionExists) { // update the data in the current chartData
    lake.chartData[windDirectionIndex].labelBatch = chartWindDirectionObject.labelBatch;
    lake.chartData[windDirectionIndex].dataWindDirectionBatch = chartWindDirectionObject.dataWindDirectionBatch;
    lake.chartData[windDirectionIndex].chartMinWindDirectionLimit = chartWindDirectionObject.chartMinWindDirectionLimit;
    lake.chartData[windDirectionIndex].chartMaxWindDirectionLimit = chartWindDirectionObject.chartMaxWindDirectionLimit;
    lake.chartData[windDirectionIndex].displayCompassSector = chartWindDirectionObject.displayCompassSector;

  } else
    lake.chartData.push(chartWindDirectionObject);

  // update the database with the 'Elev' data
  db.model("Lake").updateOne({
      'bodyOfWater': lake.bodyOfWater
    }, {
      $set: {
        "chartData": lake.chartData
      }
    })
    .exec(function (err) {
      if (err)
        console.log(error);

    })

};


function processChartWxData(data, currentLake) {
  // Building the data for the temperature charts on the back end for performance
  buildTempChartData(data.ccWxData, currentLake); // build data for temp chart tab (performance)
  // Building the data for the barometric charts on the back end for performance
  buildBaroChartData(data.ccWxData, currentLake); // build data for baro chart tab (performance)
  // Building the data for the wind speed charts on the back end for performance
  buildWindChartData(data.ccWxData, currentLake); // build data for wind speed chart tab (performance)
  // Building the data for the wind direction charts on the back end for performance
  buildWindDirectionChartData(data.ccWxData, currentLake); // build data for wind direction chart tab (performance)
  // Building the data for the humidity charts on the back end for performance
  buildHumidityChartData(data.ccWxData, currentLake); // build data for humidity chart tab (performance)
}