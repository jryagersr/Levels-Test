// Pull the lake name from the end of the current URL
let parsedURL = window.location.href.split("/");
let lakeRoute = parsedURL[parsedURL.length - 1];

// Clear old page data if it exists
$("#lakeTitle #currentLevel #currentDateTime #lakeSection").empty();
// Variable to display for current lake
// Get current Date, Time and Elev
let bodyOfWaterName = "";
let currentElev = "";
let currentDate = "";
let currentTime = "";
let currentDelta = "";

// Variable to calculate and display current pool level
let lakePool = 0;
let seaLevelDelta = 0;
let elevationAdjust = 0;

// Holds our display data to send into buildTable function
let displayBatch = [];

// Variables to hold our ad images and urls
let adLogoSrc = "";
let adLogoUrl = "";
let adTxSrc = "";
let adTxUrl = "";
let adCharitySrc = "";
let adCharityUrl = "";

// Counter variable for flowUSGS to use to sync time with elevUSGS
let k = 0;

// Function to set current values on page
function displayCurrentPageValues() {
    // Set lake title on page
    $("#lakeTitle").append(currentLake.bodyOfWater);
    $("#lakeSponsor").append(bodyOfWaterName);
    $("#lakeFeaturedTournament").append(bodyOfWaterName);
    // Set current date, time elev, and pool on page
    $("#currentTime").append(currentTime);
    $("#currentDate").append(currentDate);
    $("#currentLevel").append(currentElev);
    $("#currentDelta").append(currentDelta);
    $("#currentNormal").append("normal pool " + lakePool);
}


// Function to set current values on page
function displayCurrentPageValuesWithUTC() {
    // Set lake title on page
    $("#lakeTitle").append(currentLake.bodyOfWater);
    $("#lakeSponsor").append(bodyOfWaterName);
    $("#lakeFeaturedTournament").append(bodyOfWaterName);
    // Set current date, time elev, and pool on page
    $("#currentDate").append(currentDate);
    $("#currentTime").append(currentTime);
    $("#currentLevel").append(currentElev);
    $("#currentDelta").append(currentDelta);
    $("#currentNormal").append("normal pool " + lakePool);
}

// Function to build table on page
function buildTable(data) {
    for (var i = 0; i < data.length; i++) {
        var date = "N/A";
        var time = "N/A";
        var elev = "N/A";
        var flow = "N/A";
        // Check to see if data contains date, time, elev, or flow. If not it will stay as "N/A"
        if (typeof data[i].date !== 'undefined') {
            date = data[i].date;
        }
        if (typeof data[i].time !== 'undefined') {
            time = data[i].time;
        }
        if (typeof data[i].elev !== 'undefined') {
            elev = data[i].elev;
        }
        if (typeof data[i].flow !== 'undefined') {
            flow = data[i].flow;
        }

        // Create the HTML Well (Section) and Add the table content for each reserved table
        var lakeSection = $("<tr>");
        lakeSection.addClass("well");
        lakeSection.attr("id", "lakeWell-" + i + 1);
        $("#lakeSection").append(lakeSection);

        // Append the data values to the table row
        $("#lakeWell-" + i + 1).append("<td>" + date + "</td>");
        $("#lakeWell-" + i + 1).append("<td>" + time + "</td>");
        $("#lakeWell-" + i + 1).append("<td>" + elev + "</td>");
        $("#lakeWell-" + i + 1).append("<td>" + flow + "</td>");
    }
    // buildElevChart(data);
}
// Function to build table on page
function buildTableWithUTC(data) {
    for (var i = 0; i < data.length; i++) {
        var date = "N/A";
        var time = "N/A";
        var elev = "N/A";
        var flow = "N/A";
        // Check to see if data contains date, time, elev, or flow. If not it will stay as "N/A"
        localTime =  new Date(data[i].date);
        if (typeof data[i].date !== 'undefined') {
            date = localTime.toString().substring(0,10);
        }
        if (typeof data[i].date !== 'undefined') {
            time = localTime.toString().substring(16,21);
        }
        if (typeof data[i].elev !== 'undefined') {
            elev = data[i].elev;
        }
        if (typeof data[i].flow !== 'undefined') {
            flow = data[i].flow;
        }

        // Create the HTML Well (Section) and Add the table content for each reserved table
        var lakeSection = $("<tr>");
        lakeSection.addClass("well");
        lakeSection.attr("id", "lakeWell-" + i + 1);
        $("#lakeSection").append(lakeSection);

        // Append the data values to the table row
        $("#lakeWell-" + i + 1).append("<td>" + date + "</td>");
        $("#lakeWell-" + i + 1).append("<td>" + time + "</td>");
        $("#lakeWell-" + i + 1).append("<td>" + elev + "</td>");
        $("#lakeWell-" + i + 1).append("<td>" + flow + "</td>");
    }
    // buildElevChart(data);
}

// Function to build chart on page
function buildElevChart(data) {
    // Our data must be parsed into separate flat arrays for the chart
    let labelBatch = [];
    let dataElevBatch = [];
    // Loop through our data for 24 data points if we have it
    for (var i = 0; i < data.length; i++) {
        if (!labelBatch.includes(data[i].date)) {
            labelBatch.push(data[i].date);
            dataElevBatch.push(data[i].elev);
        }
        if (labelBatch.length > 6) {
            break;
        }
    }
    labelBatch.reverse();
    dataElevBatch.reverse();
    var ctx = document.getElementById('myElevChart').getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop(0, 'rgb(0,140,255)');
    grd.addColorStop(1, 'rgb(0,55,255)');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: labelBatch,
            datasets: [{
                label: "Level",
                // backgroundColor: 'rgb(179,221,255)',
                borderColor: 'rgb(0, 140, 255)',
                data: dataElevBatch
            }]
        },

        // Configuration options go here
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date',
                        fontSize: 20
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Level (feet)',
                        fontSize: 20
                    }
                }]
            }
        }
    });
    console.log(data[0].flow);
    if (data[0].flow !== "N/A" && typeof data[0].flow !== 'undefined') {
        buildFlowChart(data);
    }
}

// Function to build flow chart on page
function buildFlowChart(data) {
    $("#flowChart").show();
    // Our data must be parsed into separate flat arrays for the chart
    let labelBatch = [data[0].date];
    let dataFlowBatch = [];
    let flowAvg = 0;
    let flowNum = 0;

    // Loop through our data for 24 data points if we have it
    for (var i = 0; i < data.length; i++) {
        if (!labelBatch.includes(data[i].date)) {
            labelBatch.push(data[i].date);
            dataFlowBatch.push((flowAvg / flowNum).toFixed(0));
            flowAvg = Number(data[i].flow);
            flowNum = 1;
        } else {
            if (!isNaN(Number(data[i].flow))) {
                flowAvg = flowAvg + Number(data[i].flow);
                flowNum = flowNum + 1;
            }
        }
        if (labelBatch.length > 5) {
            break;
        }
    }
    // push the final avg value
    dataFlowBatch.push((flowAvg / flowNum).toFixed(0));
    labelBatch.reverse();
    dataFlowBatch.reverse();
    var ctx = document.getElementById('myFlowChart').getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop(0, 'rgb(0,140,255)');
    grd.addColorStop(1, 'rgb(0,55,255)');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: labelBatch,
            datasets: [{
                label: "Flow",
                // backgroundColor: 'rgb(179,221,255)',
                borderColor: 'rgb(0, 140, 255)',
                data: dataFlowBatch
            }]
        },

        // Configuration options go here
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date',
                        fontSize: 20
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Flow (feet)',
                        fontSize: 20
                    }
                }]
            }
        }
    });
}
function convertStringToUTC(convertedTime) {
    // Convert UTC date to local time
    // Convert to ISO format first. '2011-04-11T10:20:30Z'
    convertedTime = convertedTime.trim();
    let convertedMonth = convertedTime.substring(5, 7);
    convertedMonth = getMonthFromString(convertedMonth);
    convertedMonth = convertedMonth.toString();
    if (convertedMonth.length == 1) convertedMonth = "0" + convertedMonth;
    //Convert the string to UTC (GTM)
    convertedTime = convertedTime.substring(7, 11) + "-" + convertedMonth + "-" + convertedTime.substring(0, 2) + "T" + convertedTime.substring(12, 21) + "Z";
    //Convert the string to a Date
    //convertedTime = new Date(convertedTime);
    //Might need this call in ater
    convertedTime = new Date(convertedTime);
    //Convert the Date to local time (client)
    // convertedTime = convertedTime.toString(convertedTime);
    // Time now looks like "Thu Dec 27 2018 11:15:00 GMT-0500 (Eastern Standard Time)"
    // Substring the pieces we want to display
    return (convertedTime)
  }

// Function to make elevation USGS call
function elevUSGS(callback) {
    // API call for elev data
    $.ajax({
            url: "/api/usgs",
            method: "GET",
            data: {
                usgsURL: elevURL,
                currentLake: currentLake
            }
        })
        .then(function (data) {
            console.log(data);

            // Check to see that USGS returned data
            if (data.length > 0) {
                displayBatch = data;

                currentDate = displayBatch[0].date;
                currentTime = displayBatch[0].time;
                currentElev = displayBatch[0].elev;
                currentDelta = (currentElev - lakePool).toFixed(2);
            } else
                currentLake.bodyOfWater = currentLake.bodyOfWater + " <br> Water Level sensor down, try again later or report this outage";

            callback(null, displayBatch);
        })
}

// Function to make flow USGS call
function flowUSGS(callback) {
    // API call for elev data
    $.ajax({
            url: flowURL,
            method: "GET",
        })
        .then(function (data) {
            console.log("flowUSGS data ", data);
            // Parse through the json data to find the values we want
            let flowValues = data.value.timeSeries[0].values[0].value
            // Reverse the order of our data so most recent date is first
            flowValues.reverse();
            // Loop through the flow data, and match it to displayBatch (which already holds the elevation data)
            for (var i = 0; i < displayBatch.length; i++) {
                displayBatch[i].flow = flowValues[k].value;
                k += 4;
            }
            console.log(displayBatch)
            callback(null, displayBatch);
        });
}

// Function to make elev ACE call
function dataACE(callback) {
    // API call for elev data
    $.ajax({
            url: "/api/a2w",
            method: "GET",
            data: {
                a2wURL: elevURL,
                currentLake: currentLake
            }
        })
        .then(function (data) {
            console.log(data);

            // Check to see that ACE returned data
            if (data.length > 0) {
                displayBatch = data;

                localTime =  new Date(displayBatch[0].date);
                currentDate = localTime.toString().substring(0,10);;
                currentTime = localTime.toString().substring(16,21);
                currentElev = displayBatch[0].elev;
                currentDelta = (currentElev - lakePool).toFixed(2);
            } else
                currentLake.bodyOfWater = currentLake.bodyOfWater + " <br> Water Level sensor down, try again later or report this outage";

            callback(null, displayBatch);
        })
}

function getMonthNumberFromString(mon) {

    var d = Date.parse(mon + "1, 2012");
    if (!isNaN(d)) {
        return new Date(d).getMonth() + 1;
    }
    return -1;
}

function convertStringToUTC(convertedTime) {
    // Convert UTC date to local time
    // Convert to ISO format first. '2011-04-11T10:20:30Z'
    convertedTime = convertedTime.trim();
    let convertedMonth = convertedTime.substring(5,7);
    convertedMonth = getMonthFromString(convertedMonth);
    convertedMonth = convertedMonth.toString();
    if (convertedMonth.length == 1) convertedMonth = "0" + convertedMonth;
    //Convert the string to UTC (GTM)
    convertedTime = convertedTime.substring(7, 11) + "-" + convertedMonth + "-" + convertedTime.substring(0, 2) + "T" + convertedTime.substring(12, 21) + "Z";
    //Convert the string to a Date
    //convertedTime = new Date(convertedTime);
    //Might need this call in ater
    convertedTime = new Date(convertedTime);
    //Convert the Date to local time (client)
    // convertedTime = convertedTime.toString(convertedTime);
    // Time now looks like "Thu Dec 27 2018 11:15:00 GMT-0500 (Eastern Standard Time)"
    // Substring the pieces we want to display
    return (convertedTime)
}

function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
}

function convertUTCDate(timestamp) {
    // Multiply by 1000 because JS works in milliseconds instead of the UNIX seconds
    var date = new Date(timestamp * 1000);

    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1; // getMonth() is zero-indexed, so we'll increment to get the correct month number
    var day = date.getUTCDate();
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();

    month = (month < 10) ? '0' + month : month;
    day = (day < 10) ? '0' + day : day;
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
}

// Function to make elev TVA call
function dataTVA(callback) {
    $.ajax({
            url: "/api/tva",
            method: "GET",
            data: {
                tvaDataURL: elevURL,
                tvaLakeName: bodyOfWaterName
            }
        })
        .then(function (data) {
            console.log("TVA Call")
            console.log(data);

            if (seaLevelDelta !== 0)
                elevationAdjust = (parseFloat(data[0].Average) + seaLevelDelta).toFixed(2);
            else {
                if (lakePool == 0)
                    seaLevelDelta = lakePool;
                elevationAdjust = data[0].level;
            }

            // Set date, time and elev
            currentTime = data[0].time;
            currentDate = data[0].date;
            currentElev = elevationAdjust;
            currentDelta = (elevationAdjust - lakePool).toFixed(2);

            // Create our increment and loop through each value
            // For each value create our associated table html
            let i = 0;
            for (j = 1; j < data.length; j++) {
                let element = data[j];
                let elev = element.level;

                let date = element.date;
                let time = element.time;
                let flow = element.outflow.replace(',', '')

                // adjust the elev for lakes with data relative to full pool (not from sealevel))
                if (seaLevelDelta !== 0)
                    elev = (parseFloat(data[j].Average) + seaLevelDelta).toFixed(2);

                // Append the data values to the table row
                displayBatch.push({
                    date: date,
                    time: time,
                    elev: elev,
                    flow: flow
                })
                i++;
            }
            callback(null, displayBatch);
        })
}

// Function to make elev Duke call
function dataDuke(callback) {
    $.ajax({
            url: "/api/duke",
            method: "GET",
            data: {
                dukeDataURL: elevURL,
                dukeLakeName: bodyOfWaterName
            }
        })
        .then(function (data) {
            console.log("DUKE Call")
            console.log(data);
            // adjust the elev for lakes with data relative to full pool (not from sealevel))

            let skipToValidData = 0;

            // Duke updates their text file with future datas sometimes
            // While date is ahead of today's date, continue to loop forward
            // then check to see if the .Average value is valid (a number) if
            // not, keep looping until you get a valide .Average value.
            // This is a result of change in Dukes Data on 1/1/19 and a missing day on 1/11/19 (1/10/19 was missing)
            // as well as 1/11/19 having a .Average value of "NA"
            var now = new Date();
            var dataDate = new Date(data[skipToValidData].Date);
            while (dataDate > now) {
                skipToValidData++;
                dataDate = new Date(data[skipToValidData].Date);
            }
            // Bump index to a valid average value
            while (data[skipToValidData].Average == "NA") {
                skipToValidData++;
                dataDate = new Date(data[skipToValidData].Date);
            }

            if (seaLevelDelta !== 0)
                elevationAdjust = (parseFloat(data[skipToValidData].Average) + seaLevelDelta).toFixed(2);
            else {
                if (lakePool == 0)
                    seaLevelDelta = lakePool;
                elevationAdjust = data[skipToValidData].level;
            }

            // Set date, time and elev
            currentDate = data[skipToValidData].Date;
            currentTime = "06:00"; // No time is provided by source
            currentElev = elevationAdjust;
            currentDelta = (elevationAdjust - lakePool).toFixed(2);

            // Create our increment and loop through each value
            // For each value create our associated table html
            let i = 0;
            for (j = skipToValidData; j < data.length; j++) {
                let element = data[j];
                let elev = element.Average;

                let date = element.Date;
                let time = "";
                let flow = "N/A";

                // adjust the elev for lakes with data relative to full pool (not from sealevel))
                if (seaLevelDelta !== 0)
                    elev = (parseFloat(data[j].Average) + seaLevelDelta).toFixed(2);

                displayBatch.push({
                    date: date,
                    time: "06:00",
                    elev: elev,
                    flow: flow
                })
                i++;
            };
            callback(null, displayBatch)
        });
}; // End of dataDuke

// Function to make elev CUBE call
function elevCUBE(callback) {
    // API call for flow
    $.ajax({
            url: "/api/cube",
            method: "GET",
        })
        .then(function (data) {
            console.log("CUBE Call")
            console.log(data)
            displayBatch = data;
            // Determine which lake has been selected of the three cube lakes
            if (lakeRoute === "highrock") {
                displayBatch = data[0].data;
            } else if (lakeRoute === "badin") {
                displayBatch = data[1].data;
            } else if (lakeRoute === "tuckertown") {
                displayBatch = data[2].data;
            }

            // Set current Date, Time and Elev
            currentElev = displayBatch[0].elev;
            currentDate = displayBatch[0].date;
            currentTime = "600";
            currentDelta = (currentElev - lakePool).toFixed(2);

            // Loop through and plug in "6:00" as time for each since data is daily only
            for (var i = 0; i < displayBatch.length; i++) {
                displayBatch[i].time = "6:00";
            }
            callback(null, displayBatch);
        })
}

// Function to make alabama calls
function elevAlab(callback) {
    // API call for flow
    $.ajax({
            url: "/api/alabama",
            method: "GET",
            data: ({
                lakeRoute: lakeRoute
            })
        })
        .then(function (data) {
            console.log("Alab Call")
            console.log(data)

            // Set current Date, Time and Elev
            currentElev = data[0].elev;
            currentDate = data[0].date;
            currentTime = data[0].time;
            currentDelta = (currentElev - lakePool).toFixed(2);

            displayBatch = data;
            callback(null, displayBatch);
        })
}

// Function to make elev SJRWMD call St Johns River Water Management District
function dataSJRWMD(callback) {
    $.ajax({
            url: "/api/sjrwmd",
            method: "GET",
            data: {
                sjrwmdDataURL: elevURL,
                sjrwmdLakeName: bodyOfWaterName
            }
        })
        .then(function (data) {
            console.log("CUBE Call");
            console.log(data);
            // Set current Date, Time and Elev
            currentElev = data[0].level;
            currentDate = data[0].date;
            currentTime = data[0].time;
            currentDelta = (currentElev - lakePool).toFixed(2);

            // Create our increment and loop through each value
            // For each value create our associated table html

            for (j = 0; j < data.length; j++) {
                let element = data[j];
                let elev = element.level;

                let date = element.date;
                let time = element.time
                let flow = "N/A";

                // adjust the elev for lakes with data relative to full pool (not from sealevel))
                if (seaLevelDelta !== 0)
                    elev = (parseFloat(data[j].Average) + seaLevelDelta).toFixed(2);

                displayBatch.push({
                    date: date,
                    time: time,
                    elev: elev,
                    flow: flow
                })
            };
            callback(null, displayBatch)
        });
}; // End of dataSJRWMD

// Function to make elev TWDB call Texas Water Development Board
function dataTWDB(callback) {
    $.ajax({
            url: "/api/twdb",
            method: "GET",
            data: {
                twdbDataURL: elevURL,
                twdbLakeName: bodyOfWaterName
            }
        })
        .then(function (data) {
            console.log("CUBE Call");
            console.log(data);
            // Set current Date, Time and Elev
            currentElev = data[0].level;
            currentDate = data[0].date;
            currentTime = data[0].time;
            currentDelta = (currentElev - lakePool).toFixed(2);

            // Create our increment and loop through each value
            // For each value create our associated table html

            for (j = 0; j < data.length; j++) {
                let element = data[j];
                let elev = element.level;

                let date = element.date;
                let time = element.time
                let flow = "";

                // adjust the elev for lakes with data relative to full pool (not from sealevel))
                if (seaLevelDelta !== 0)
                    elev = (parseFloat(data[j].Average) + seaLevelDelta).toFixed(2);

                displayBatch.push({
                    date: date,
                    time: time,
                    elev: elev,
                    flow: flow
                })
            };
            callback(null, displayBatch)
        });
}; // End of dataTWDB

// Function to dynamically place advertisement on thisLake.html page
function loadAds() {
    if (typeof adLogoSrc !== 'undefined') {
        $("#adLogoWell").append("<a href='" + adLogoUrl + "' target='_blank'><img class='ad-logo' src='" + adLogoSrc + "'/></a>");
    }
    if (typeof adTxSrc !== 'undefined') {
        $("#adTxWell").append("<a href='" + adTxUrl + "' target='_blank'><img class='ad-logo' src='" + adTxSrc + "'/></a>");
    }
    if (typeof adCharitySrc !== 'undefined') {
        $("#adCharityWell").append("<a href='" + adCharityUrl + "' target='_blank'><img class='ad-logo' src='" + adCharitySrc + "'/></a>");
    }
}


// User clicked on Tournaments Button on Lake page
// display tournaments filtered by lake
$("#lakeTournaments").on("click", function (e) {
    console.log("Made it to function lakesTournament")
})

// Get all lake data from lakeData.js
// Declare variable to hold currentLake object
var currentLake = {};
$.ajax({
        url: "/api/lake-data",
        method: "GET",
    })
    .then(function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            result = data[i].lakes.find(obj => obj.href === "/lakes/" + lakeRoute);
            if (typeof result !== 'undefined') {
                currentLake = result;
                break;
            }
        }
        console.log(currentLake);
        // Set all of our baseline data
        bodyOfWaterName = currentLake.bodyOfWater;
        lakePool = currentLake.normalPool;
        seaLevelDelta = currentLake.seaLevelDelta;
        elevURL = currentLake.elevURL;
        flowURL = currentLake.flowURL;
        adLogoSrc = currentLake.adLogoSrc;
        adLogoUrl = currentLake.adLogoUrl;
        adTxSrc = currentLake.adTxSrc;
        adTxUrl = currentLake.adTxUrl;
        adCharitySrc = currentLake.adCharitySrc;
        adCharityUrl = currentLake.adCharityUrl;

        // Loop through the lake data sources and run associated functions
        for (var i = 0; i < currentLake.dataSource.length; i++) {
            let source = currentLake.dataSource[i];
            if (source === "ACE") {
                dataACE(function () {
                    displayCurrentPageValuesWithUTC();
                    buildTableWithUTC(displayBatch);
                });
            } else if (source === "USGS") {
                elevUSGS(function () {
                    if (flowURL !== "none") {
                        flowUSGS(function () {
                            displayCurrentPageValues();
                            buildTable(displayBatch);
                        });
                    } else {
                        displayCurrentPageValues();
                        buildTable(displayBatch);
                    }
                });
            } else if (source === "TVA") {
                dataTVA(function () {
                    displayCurrentPageValues();
                    buildTable(displayBatch);
                });
            } else if (source === "CUBE") {
                elevCUBE(function () {
                    displayCurrentPageValues();
                    buildTable(displayBatch);
                });
            } else if (source === "ALAB") {
                elevAlab(function () {
                    displayCurrentPageValues();
                    buildTable(displayBatch);
                });
            } else if (source === "DUKE") {
                dataDuke(function () {
                    displayCurrentPageValues();
                    buildTable(displayBatch);
                });
            } else if (source === "SJRWMD") {
                dataSJRWMD(function () {
                    displayCurrentPageValues();
                    buildTable(displayBatch);
                });
            } else if (source === "TWDB") {
                dataTWDB(function () {
                    displayCurrentPageValues();
                    buildTable(displayBatch);
                });
            } else if (source === "loadAds") {
                loadAds();
            }
        }
    })

// Api call to fetch weather data
// let apiKey = "d620419cfbb975f425c6262fefeef8f3";
// $.ajax({
//     url: "http://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?date=1527811200&opacity=0.9&fill_bound=true&appid=" + apiKey,
//     method: "GET"
// })
//     .then(function(data) {
//         console.log(data);
//     });