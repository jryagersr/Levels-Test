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

let elevCheck = false;
let flowCheck = false;
// Variables to hold our ad images and urls
let adLogoSrc = "";
let adLogoUrl = "";

// Function to set current values on page
function displayCurrentPageValues() {
    // Set lake title on page
    $("#lakeTitle").append(bodyOfWaterName);
    $("#lakeSponsor").append(bodyOfWaterName);
    $("#lakeFeaturedTournament").append(bodyOfWaterName);
    // Set current date, time elev, and pool on page
    $("#currentTime").append(currentTime);
    $("#currentDate").append(currentDate);
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
        if (data[i].date) {
            date = data[i].date;
        }
        if (data[i].time) {
            time = data[i].time;
        }
        if (data[i].elev) {
            elev = data[i].elev;
        }
        if (data[i].flow) {
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
}

// Function to make elevation USGS call
let k = 0; // Counter variable for flowUSGS to use to sync time with elevUSGS
function elevUSGS(callback) {
    // API call for flow
    $.ajax({
        url: elevURL,
        method: "GET",
    })
        .then(function (data) {
            console.log('USGS Elev Data', data);
            // Parse the json data return to find the values we want
            let dataValues = data.value.timeSeries[0].values[0].value;
            // Reverse the order of our data so most recent date is first
            dataValues.reverse();

            if (seaLevelDelta !== 0)
                elevationAdjust = (parseFloat(dataValues[0].value) + seaLevelDelta).toFixed(2);
            else {
                if (lakePool !== 0)
                    elevationAdjust = dataValues[0].value;
                else elevationAdjust = dataValues[0].value;
            }

            // Set current Date, Time and Elev
            currentElev = elevationAdjust;
            let splitTimeDate = dataValues[0].dateTime.split("T");
            currentDate = splitTimeDate[0];
            currentTime = splitTimeDate[1].substring(0, 5);
            currentDelta = (currentElev - lakePool).toFixed(2);

            // Function to display our current page values
            displayCurrentPageValues();

            // Find first time value that is at the top of the hour
            switch (dataValues[0].dateTime.substring(14, 16)) {

                case "00":
                    var j = 0;
                    break;

                case "15":
                    var j = 1;
                    break;

                case "30":
                    var j = 2;
                    break;

                case "45":
                    var j = 3;
                    break;

                default:
                    if (lakeRoute == "jordan" || lakeRoute == "kerr" || lakeRoute == "buggsisland") {
                        alert("Check USGS Elev Time");
                    } else {
                        var j = 0;
                    }
            }
            // Create our increment and loop through each value
            // For each value push an object into displayBatch
            // Set our counter K variable before incrementing for flowUSGS to use
            k = j;
            for (j; j < dataValues.length; j += 4) {
                let element = dataValues[j];
                let elev = element.value;
                let splitTimeDate = element.dateTime.split("T");
                let date = splitTimeDate[0].substring(2, 10).replace('-', ' ');
                let time = splitTimeDate[1].substring(0, 5);
                // adjust the elev for lakes with data relative to full pool (not from sealevel))
                if (seaLevelDelta !== 0) {
                    elev = (parseFloat(dataValues[j].value) + seaLevelDelta).toFixed(2);
                }

                displayBatch.push({
                    date: date,
                    time: time,
                    elev: elev
                });
            }
            callback(null, displayBatch);
        })
}

// Function to make flow USGS call
function flowUSGS(callback) {
    if (flowURL !== "none") {
        // API call for flow
        $.ajax({
            url: flowURL,
            method: "GET",
        })
            .then(function (data) {
                console.log("flowUSGS data ", data);
                // Parse through the json data to find the values we want
                let dataValues = data.value.timeSeries[0].values[0].value
                // Reverse the order of our data so most recent date is first
                dataValues.reverse();
                // Loop through the flow data, and match it to displayBatch (which already holds the elevation data)
                for (var i = 0; i < displayBatch.length; i++) {
                    displayBatch[i].flow = dataValues[k].value;
                    k += 4;
                }
                callback(null, displayBatch);
            });
    }
    // Callback empty data without Ajax if flowURL = "none"
    callback(null, displayBatch);
}


//==========================================================================================================

// Code from John that got out of place when merging. I think it belongs in the aceFlow function

//                 case "45":
//                     var usgsIndex = 3
//                     break;

//                 default:
//                     if (lakeRoute == "jordan" || lakeRoute == "kerr" || lakeRoute == "buggsisland") {
//                         alert("Check ACE Flow Time");
//                     } else j = 0;

//             }

//             let aceIndex = 0;
//             let lakewellIndex = 0;
//             let aceTime = '0000'; // Time on current ACE line
//             let usgsTime = '0'; // Time on current USGS line

//             // Code readability, will be set to comparison of times in loop
//             let timesAreNotEqual = false;
//             let aceTimeGreater = false;
//             let daysAreEqual = false;
//             let dataIsLinedUpByTime = false;

//             // Check to see if the first ACE flow data line is same time as USGS first line time and the same day 
//             // (don't care about month right now)
//             // Can fix the month problem later 
//             //(only an issue when site down as time goes by midnight last day of month)

//             for (usgsIndex; usgsIndex < dataTables.length; usgsIndex += 4) {
//                 data[aceIndex].time = data[aceIndex].time.substr(0, 2).concat("00");
//                 if (data[aceIndex].time === '2400') { // ACE represents midnight as 2400 of passing day, Jordan Lake on "0031"
//                     aceTime = '0000' // USGS represents midnight as 0000 of next day (Dates are different)
//                 } else aceTime = data[aceIndex].time.replace("31", '00');

//                 usgsTime = dataTables[usgsIndex].dateTime.substring(11, 16).replace(':', ''); // Pulls the USGS time from the line and removes the : (ACE does not have a colon)

//                 // Set Booleans for conditionals below, days have OR due to difference in representation of midnight
//                 timesAreNotEqual = usgsTime !== aceTime;
//                 aceTimeGreater = parseInt(dataTables[usgsIndex].dateTime.substring(11, 16).replace(':', ''), 10) < parseInt(aceTime, 10);
//                 if (!daysAreEqual)
//                     daysAreEqual = (data[aceIndex].date.substring(0, 2) == dataTables[usgsIndex].dateTime.substring(8, 10)) || aceTime == '0000';

//                 // PLEASE LEAVE THIS SWITCH COMMENTED OUT, I'll need it to fix when the month changes.
//                 //switch (data[aceIndex].date.substring(2, 6)) {

//                 // If case is org, then run the sort function and create a newBatch, then display using the newBath
//                 // Change our sort boolean to keep track of asc/desc
//                 //    case "'DEC":
//                 //        if (dataTables[usgsIndex].dateTime.substring(5, 7) == 12)
//                 //            monthsAreEqual = true
//                 //        break;

//                 // }

//                 let element = data[aceIndex]; // define element for template updates below.

//                 if (daysAreEqual && !timesAreNotEqual) {
//                     if (!timesAreNotEqual) {
//                         //if (aceTimeGreater) { // is ACE Time newer than USGS (ACE has newer data?)
//                         //    usgsIndex = usgsIndex - 4; // Stay on current USGS line by decrementing loop counter
//                         //} else { // ACE Time is less than USGS Time (ACE site down)

//                         //    console.log('lakewellIndex1', lakewellIndex);
//                         //    $("#lakeWell-" + (lakewellIndex) + 1).append("<td>" + "N/A1" + "</td>"); //Append N/A as the Flow Value to the row for the missing data
//                         //    lakewellIndex++; //Move to next Lakewell Template line
//                         // }
//                         //} else { // Times are equal, post data to Lakewell template
//                         $("#lakeWell-" + lakewellIndex + 1).append("<td>" + element.outflow + "</td>");
//                         lakewellIndex++;

//                         if (!timesAreNotEqual) {
//                             dataIsLinedUpByTime = true;
//                         }
//                     }
//                 } else if (aceTimeGreater) {
//                     $("#lakeWell-" + lakewellIndex + 1).append("<td>" + "N/A" + "</td>"); //Append N/A as the Flow Value to the row for the missing data
//                     lakewellIndex++;
//                     aceIndex--;
//                 }
//                 aceIndex++; // Increment loop counter ACE data and LakeWell template
//             }
//             console.log(data);
//         });
// }

// ===========================================================================================================



// Function to make elev ACE call
function dataACE() {
    // API call for flow
    $.ajax({
        url: "/api/a2w",
        method: "GET",
        data: {
            a2wURL: elevURL,
        }
    })
        .then(function (data) {
            console.log(data);
            // Get current Date, Time and Elev
            // Convert ACE date to javascript Date format "12/24/2016 02:00:00"

            // Indexes into data for the first entry
            lastElevIndex = data[0].Elev.length - 1;
            if (!noACEFlow)
                lastFlowIndex = data[1].Outflow.length - 1;

            // Convert UTC date to local time
            let localTime = convertStringToUTC(data[0].Elev[lastElevIndex].time)
            currentDate = localTime.substring(4, 10) + " " + localTime.substring(13, 15);
            currentTime = localTime.substring(16, 21);

            currentElev = parseFloat(data[0].Elev[lastElevIndex].value).toFixed(2);
            //let currentDate = data[0].Elev[lastElevIndex].time.substring(0, 7) + data[0].Elev[lastElevIndex].time.substring(9, 12);

            //let currentTime = data[0].Elev[lastElevIndex].time.substring(11, 17);
            currentDelta = (currentElev - lakePool).toFixed(2);

            // Run function to display all current values
            displayCurrentPageValues();

            // Create our increment and loop through each value
            // For each value create our associated table html
            let i = 0;
            let flow = 0;
            let lastHourDisplayed = -1;
            let displayFlowData = true; // This is for this loop, some lakes we have to sort through the times (Istokpoga, FL)
            if (!noACEFlow)
                i = lastFlowIndex;
            let jIncrement = 1;
            if (!dailyACEData || moreElevThanFlow)
                jIncrement = 4;
            for (j = lastElevIndex; j >= 0; j = j - jIncrement) {
                let elev = data[0].Elev[j].value.toFixed(2);
                localTime = convertStringToUTC(data[0].Elev[j].time)
                let date = localTime.substring(4, 10) + " " + localTime.substring(13, 15);
                let time = localTime.substring(16, 21);
                flow = 'N/A'; // default value
                if (!noACEFlow)
                    if (data[1].Outflow[i].value !== -99)
                        flow = data[1].Outflow[i].value;

                // Create the HTML Well (Section) and Add the table content for each reserved table
                var lakeSection = $("<tr>");
                lakeSection.addClass("well");
                lakeSection.attr("id", "lakeWell-" + j + 1);
                if (dataFromACEIsFucked == true && localTime.substring(16, 18) == lastHourDisplayed) {
                    displayFlowData = false;
                } else {
                    lastHourDisplayed = localTime.substring(16, 18);
                    displayFlowData = true;
                }
                if (displayFlowData) {
                    $("#lakeSection").append(lakeSection);

                    // Append the data values to the table row

                    $("#lakeWell-" + j + 1).append("<td>" + date + "</td>");
                    $("#lakeWell-" + j + 1).append("<td>" + time + "</td>");
                    $("#lakeWell-" + j + 1).append("<td>" + elev + "</td>");
                    if (!noACEFlow)
                        $("#lakeWell-" + j + 1).append("<td>" + flow + "</td>");
                }
                if (i === 0) {
                    j = 0
                } else {
                    i--;
                }
            }
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
    let convertedMonth = convertedTime.substring(3, 6);
    convertMonth = getMonthFromString(convertedMonth);
    //Convert the string to UTC (GTM)
    convertedTime = convertedMonth + "/" + convertedTime.substring(0, 2) + "/" + convertedTime.substring(7, 11) + " " + convertedTime.substring(12, 21) + " UTC";
    //Convert the string to a Date
    convertedTime = new Date(convertedTime);
    //Might need this call in ater
    //convertUTCDate(convertedTime);
    //Convert the Date to local time (client)
    convertedTime = convertedTime.toString(convertedTime);
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
function dataTVA(data) {
    $.ajax({
        url: "/api/tva",
        method: "GET",
        data: {
            tvaDataURL: elevURL,
            tvaLakeName: bodyOfWaterName
        }
    })
        .then(function (data) {
            console.log(lakeRoute)

            if (seaLevelDelta !== 0)
                elevationAdjust = (parseFloat(data[0].Average) + seaLevelDelta).toFixed(2);
            else {
                if (lakePool == 0)
                    seaLevelDelta = lakePool;
                elevationAdjust = data[0].level;
            }
            // Set lake title on page
            $("#lakeTitle").append(bodyOfWaterName);
            $("#lakeSponsor").append(bodyOfWaterName);
            $("#lakeFeaturedTournament").append(bodyOfWaterName);

            //let currentDelta = (data[0].level - lakePool).toFixed(2);
            let currentDelta = (elevationAdjust - lakePool).toFixed(2);

            // Set date, time and elev on page
            $("#currentTime").append(data[0].date);
            $("#currentDate").append(data[0].time);
            $("#currentLevel").append(elevationAdjust);
            $("#currentDelta").append(currentDelta);
            $("#currentNormal").append("normal pool " + lakePool);


            // Create our increment and loop through each value
            // For each value create our associated table html
            let i = 0;
            for (j = 1; j < data.length; j++) {
                let element = data[j];
                let elev = element.level;

                let date = element.date;
                let time = element.time;
                let flow = element.outflow;

                // adjust the elev for lakes with data relative to full pool (not from sealevel))
                if (seaLevelDelta !== 0)
                    elev = (parseFloat(data[j].Average) + seaLevelDelta).toFixed(2);

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
                i++;
            }
        })
}

// Function to make elev Duke call
function dataDuke(data) {
    $.ajax({
        url: "/api/duke",
        method: "GET",
        data: {
            dukeDataURL: elevURL,
            dukeLakeName: bodyOfWaterName
        }
    })
        .then(function (data) {
            console.log(data);
            // adjust the elev for lakes with data relative to full pool (not from sealevel))

            let skipToValidData = 0;

            // Duke updates their text file with future datas sometimes
            // While date is ahead of today's date, continue to loop forward
            var now = new Date();
            var dataDate = new Date(data[skipToValidData].Date);
            while (dataDate > now) {
                skipToValidData++;
                dataDate = new Date(data[skipToValidData].Date);
                console.log(dataDate);
            }
            console.log(skipToValidData);

            if (seaLevelDelta !== 0)
                elevationAdjust = (parseFloat(data[skipToValidData].Average) + seaLevelDelta).toFixed(2);
            else {
                if (lakePool == 0)
                    seaLevelDelta = lakePool;
                elevationAdjust = data[skipToValidData].level;
            }
            // Set lake title on page
            $("#lakeTitle").append(bodyOfWaterName);
            $("#lakeSponsor").append(bodyOfWaterName);
            $("#lakeFeaturedTournament").append(bodyOfWaterName);

            //let currentDelta = (data[0].Average - lakePool).toFixed(2);
            let currentDelta = (elevationAdjust - lakePool).toFixed(2);

            // Set date, time and elev on page
            $("#currentTime").append(data[skipToValidData].Date);
            $("#currentDate").append(data[skipToValidData].time);
            $("#currentLevel").append(elevationAdjust);
            $("#currentDelta").append(currentDelta);
            $("#currentNormal").append("normal pool " + lakePool);


            // Create our increment and loop through each value
            // For each value create our associated table html
            let i = 0;
            for (j = skipToValidData; j < data.length; j++) {
                let element = data[j];
                let elev = element.Average;

                let date = element.Date;
                let time = "";
                let flow = "";

                // adjust the elev for lakes with data relative to full pool (not from sealevel))
                if (seaLevelDelta !== 0)
                    elev = (parseFloat(data[j].Average) + seaLevelDelta).toFixed(2);

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
                i++;
            };
        });
}; // End of dataDuke

// Function to make elev CUBE call
function elevCUBE() {
    // API call for flow
    $.ajax({
        url: "/api/cube",
        method: "GET",
    })
        .then(function (data) {
            displayBatch = data;
            // Determine which lake has been selected of the three cube lakes
            if (lakeRoute === "highrock") {
                displayBatch = data[0].data;
            }
            else if (lakeRoute === "badin") {
                displayBatch = data[1].data;
            }
            else if (lakeRoute === "tuckertown") {
                displayBatch = data[2].data;
            }

            // Set current Date, Time and Elev
            currentElev = displayBatch[0].elev;
            currentDate = displayBatch[0].date;
            currentTime = "600";
            currentDelta = (currentElev - lakePool).toFixed(2);

            // Function to display bodyofWaterName and current values
            displayCurrentPageValues();

            // Loop through and plug in "6:00" as time for each since data is daily only
            for (var i = 0; i < displayBatch.length; i++) {
                displayBatch[i].time = "6:00";
            }
            // Function to build table with new data newBatch
            buildTable(displayBatch);
        })
}

// Function to make alabama calls
function elevAlab() {
    // API call for flow
    $.ajax({
        url: "/api/alabama",
        method: "GET",
        data: ({ lakeRoute: lakeRoute })
    })
        .then(function (data) {

            // Set current Date, Time and Elev
            currentElev = data[0].elev;
            currentDate = data[0].date;
            currentTime = data[0].time;
            currentDelta = (currentElev - lakePool).toFixed(2);

            // Function to display bodyofWaterName and current values
            displayCurrentPageValues();

            // Function to build table with new data newBatch
            buildTable(data);
        })
}

// Function to dynamically place advertisement on thisLake.html page
function placeLogoAd() {
    $("#adLogoWell").append("<a href='" + adLogoUrl + "' target='_blank'><img class='ad-logo' src='" + adLogoSrc + "'/></a>");
}

// function getData() {
//     if (elevUSGSCheck === "true") {
//         elevUSGS(function() {             flowUSGS(function() {                 buildTable(displayBatch);             });         });
//     }

//     if (flowUSGSCheck === "true") {
//         flowUSGS();
//     }

//     if (flowACECheck === "true") {
//         kerrElevFlow();
//     }


// if USGS elev is needed
// run elevUSGS()
// if USGS flow is needed
// run flowUSGS()
// if ACE flow is needed
// run ACE flow
// once all complete
// run display data

// User clicked on Tournaments Button on Lake page
// display tournaments filtered by lake
$("#lakeTournaments").on("click", function (e) {
    console.log("Made it to function lakesTournament")
})

let dailyACEData = false; // default value, this is for when ACE only returns daily readings vs hourly
let noACEFlow = false; // default value, this is when ACE has no Flow Data included
let moreElevThanFlow = false; // default value, this is when ACE returns elev data in 15 min intervals and flow data in hourly intervals. Loop j variable increment set to 1 or 4 by this flag
let dataFromACEIsFucked = false; // default value, this is when the ACE data is Fucked Up like Istokpoga in Florida, Damn...

// console.log("if: " + lakes[lakeRoute]);

// Switch to set our api urls based on lake name
// Run corresponding api calls
switch (lakeRoute) {
    case "kerr": //North Carolina
        lakePool = 300;
        seaLevelDelta = 0;
        moreElevThanFlow = true;
        bodyOfWaterName = "Kerr Lake"
        elevURL = "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1749041&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON";
        dataACE()
        adLogoSrc = "/assets/img/jse.png";
        adLogoUrl = "http://jacksonsuperiorelectric.com/";
        placeLogoAd();
        break;

    case "falls": //North Carolina
        lakePool = 252;
        seaLevelDelta = 0;
        moreElevThanFlow = true;
        bodyOfWaterName = "Falls Lake";
        elevURL = "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1745041&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON";
        dataACE()
        break;

    case "jordan": //North Carolina
        lakePool = 216.5;
        seaLevelDelta = 0;
        moreElevThanFlow = true;
        bodyOfWaterName = "Jordan Lake";
        elevURL = "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1743041&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON";
        dataACE();
        break;

    case "neuse": // North Carolina
        lakePool = 0.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Neuse River (Kinston)";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02089500&period=PT96H&parameterCd=00065&siteType=ST&siteStatus=all";
        flowURL = "none";
        elevUSGS();
        break;

    case "hyco": //North Carolina
        lakePool = 360.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Hyco";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02168500&period=PT96H&parameterCd=00062&siteType=ST&siteStatus=all";
        flowURL = "none";
        elevUSGS();
        break;

    case "highrock": // North Carolina
        lakePool = 655.2;
        bodyOfWaterName = "High Rock";
        url = "/api/cube";
        elevCUBE(url);
        break;

    case "badin": // North Carolina
        lakePool = 541.1;
        bodyOfWaterName = "Badin";
        elevCUBE();
        break;

    case "tuckertown": // North Carolina
        lakePool = 596;
        bodyOfWaterName = "Tuckertown";
        elevCUBE();
        break;

    case "roanoke": // North Carolina
        lakePool = 0.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Roanoke River (Hwy 45)";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=0208114150&period=PT96H&parameterCd=00065&siteType=ST&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "murray": //South Carolina
        lakePool = 360.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Lake Murray";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02168500&period=PT96H&parameterCd=00062&siteType=ST&siteStatus=all";
        flowURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02168504&period=PT96H&parameterCd=00060&siteType=ST&siteStatus=all";
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;


    case "hartwell": //South Carolina
        lakePool = 660.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Lake Hartwell";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02187010&period=PT96H&parameterCd=00062&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "clarkshill": //South Carolina
        lakePool = 330.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Clarks Hill";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02193900&period=PT96H&parameterCd=00062&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "santee1": //South Carolina
        lakePool = 79.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Santee (Marion)";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02171000&period=PT96H&parameterCd=00062&siteType=ST&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "santee2": //South Carolina
        lakePool = 79.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Santee (Moultrie)";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02172000&period=PT96H&parameterCd=00062&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "james": //Virgina - River
        lakePool = 0.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "James River";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02042770&period=PT96H&parameterCd=62620&siteType=ST&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "potomac": //Virgina - River
        lakePool = 0.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Potomac River (Alexandria)";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=0165258890&period=PT96H&parameterCd=62620&siteType=ST&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "lanier": //Georgia
        lakePool = 1071.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Lake Lanier";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02334400&period=PT96H&parameterCd=00062&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "westpoint": //Georgia
        lakePool = 635.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "West Point";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02339400&period=PT96H&parameterCd=00062&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "conroe": //Texas
        lakePool = 201.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Conroe";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08067600&period=PT96H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none";
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "fork": //Texas
        lakePool = 403.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Lake Fork";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08018800&period=PT96H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "toledobend": //Texas
        lakePool = 172.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Toledo Bend";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08025350&period=PT96H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "rayburn": //Texas
        lakePool = 164.4;
        seaLevelDelta = 0;
        bodyOfWaterName = "Sam Rayburn";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08039300&period=PT96H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "monroe": //Indiana
        lakePool = 538.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Monroe";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03372400&period=PT96H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "ohioriverin": //Indiana - River
        lakePool = 0.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Ohio River Evansville";
        elevURL = "http://waterservices.usgs.gov/nwis/iv/?format=json&sites=03322000&period=PT96H&parameterCd=00065&siteType=ST&siteStatus=all";
        flowURL = "none";
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "patoka": //Indiana
        lakePool = 536.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Patoka";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03374498&period=PT96H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "shenango": //Pennsylvania
        lakePool = 894.67;
        seaLevelDelta = 0;
        bodyOfWaterName = "Shenango";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03103400&period=PT96H&parameterCd=62615&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "curwensville": //Pennsylvania
        lakePool = 1162.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Curwensville";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01541180&period=PT96H&parameterCd=00062&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "raystown": //Pennsylvania
        lakePool = 786.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Raystown";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01563100&period=PT96H&parameterCd=00062&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "champlain": //New York
        lakePool = 95.5;
        seaLevelDelta = 0;
        bodyOfWaterName = "Champlain";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04294413&period=PT96H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "winnebago": //Wisconsin
        lakePool = 746.0; // 746ft but data reported as a delta to full pool.
        seaLevelDelta = 746.0;
        bodyOfWaterName = "Winnebago";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04082500&period=PT96H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "geneva": // Wisconsin
        lakePool = 879.0; // 879ft but data reported as a delta to full pool.
        seaLevelDelta = 879.0;
        bodyOfWaterName = "Geneva";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=423525088260400&period=PT96H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "havasu": //California
        lakePool = 445.0; // 445ft but data reported as a delta to full pool.
        seaLevelDelta = 445.0;
        bodyOfWaterName = "Havasu";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=423525088260400&period=PT96H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "clear": //California
        lakePool = 1329.0; // 1329ft but data reported as a delta to full pool
        seaLevelDelta = 1329.0;
        bodyOfWaterName = "Clear";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=11450000&period=PT96H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "mojave": //Nevada
        lakePool = 647.0; // 647ft but data reported as a delta to 0.
        seaLevelDelta = 547;
        bodyOfWaterName = "Mojave";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=09422500&period=PT96H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "wildhorse": //Nevada
        lakePool = 6208.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Wild Horse";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=13174000&period=PT96H&parameterCd=00062&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "trinidad": //Colorado
        lakePool = 6300.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Trinidad";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07124400&period=PT96H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "riflegap": //Colorado
        lakePool = 6000.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Rifle Gap";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=09091900&period=PT96H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "minnetonka": //Minnesota
        lakePool = 929.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Minnetonka";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=05289000&period=PT96H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "millelacs": //Minnesota
        lakePool = 1251.0; //1251ft reported as a delta to 0
        seaLevelDelta = 1151.0;
        bodyOfWaterName = "Mille Lacs";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=05284000&period=PT96H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "clinton": //Kansas
        lakePool = 875.50;
        seaLevelDelta = 0;
        bodyOfWaterName = "Clinton";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=06891478&period=PT95H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "perry": //Kansas
        lakePool = 891.50;
        seaLevelDelta = 0;
        bodyOfWaterName = "Perry"
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=06890898&period=PT95H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "pomona": //Kansas
        lakePool = 974.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Pomona";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=06912490&period=PT95H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "malvern": //Kansas
        lakePool = 1039.67;
        seaLevelDelta = 0;
        bodyOfWaterName = "Malvern";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=06910997&period=PT95H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "ellsworth": //Oklahoma
        lakePool = 1232.5;
        seaLevelDelta = 0;
        bodyOfWaterName = "ellsworth";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07308990&period=PT95H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "hudson": //Oklahoma
        lakePool = 619.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Hudson";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07191400&period=PT95H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "lawtonka": //Oklahoma
        lakePool = 1343.6;
        seaLevelDelta = 0;
        bodyOfWaterName = "Lawtonka"
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07309500&period=PT95H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "cherokees": //Oklahoma
        lakePool = 739.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Lake O' the Cherokees"
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07190000&period=PT95H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "eucha": //Oklahoma
        lakePool = 778.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Eucha"
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07191285&period=PT95H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "mcghee": //Oklahoma
        lakePool = 577.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "McGhee Creek"
        elevURL = "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1550051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        // dataACE();
        break;

    case "texoma":
        lakePool = 619.41; //Oklahoma
        seaLevelDelta = 0;
        bodyOfWaterName = "Texoma"
        elevURL = "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=2063051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        // dataACE();
        break;

    case "westokoboji": // Iowa
        lakePool = 1398.0; // 1398.0 ft Level reported as a delta to full pool by USGS
        seaLevelDelta = 1398.0;
        bodyOfWaterName = "West Okoboji"
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=06604200&period=PT96H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "seminole": // Florida
        lakePool = 78.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Seminole"
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02357500&period=PT96H&parameterCd=00062&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS(function () { flowUSGS(function () { buildTable(displayBatch); }); });
        break;

    case "guntersville": // Alabama
        lakePool = 594.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Guntersville"
        elevURL = "http://r7j8v4x4.map2.ssl.hwcdn.net/GUH_O.xml?1545499372503";
        flowURL = "none"
        dataTVA();
        break;

    case "chickamauga": // Tennessee
        lakePool = 682.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Chickamauga"
        elevURL = "http://r7j8v4x4.map2.ssl.hwcdn.net/CHH_O.xml?1545581570023";
        flowURL = "none"
        dataTVA();
        break;

    case "pickwick": // Alabama
        lakePool = 414.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Pickwick"
        elevURL = "http://r7j8v4x4.map2.ssl.hwcdn.net/PKH_O.xml?1545582182415";
        flowURL = "none"
        dataTVA();
        break;

    case "dalehollow": // Tennessee
        lakePool = 651.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Dale Hollow"
        elevURL = "http://r7j8v4x4.map2.ssl.hwcdn.net/DHH_O.xml?1545582944732";
        flowURL = "none"
        dataTVA();
        break;

    case "kentucky": // Kentucky
        lakePool = 359.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Kentucky"
        elevURL = "http://r7j8v4x4.map2.ssl.hwcdn.net/KYH_O.xml?1545580918909";
        flowURL = "none"
        dataTVA();
        break;

    case "percypriest": // Tennessee
        lakePool = 489.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Percy Priest"
        elevURL = "http://r7j8v4x4.map2.ssl.hwcdn.net/JPH_O.xml?1545583512033";
        flowURL = "none"
        dataTVA();
        break;

    case "barkley": // Kentucky
        lakePool = 358.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Barkley"
        elevURL = "http://r7j8v4x4.map2.ssl.hwcdn.net/BAH_O.xml?1545583937120";
        flowURL = "none"
        dataTVA();
        break;

    case "nickajack": // Tennessee
        lakePool = 692.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Nickajack"
        elevURL = "http://r7j8v4x4.map2.ssl.hwcdn.net/NJH_O.xml?1545584741938";
        flowURL = "none"
        dataTVA();
        break;

    case "eufaula": // Alabama
        lakePool = 585.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Eufaula";
        flowURL = "none"
        elevURL = "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1882051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON";
        dataACE();
        break;


    case "wheeler": // Alabama
        lakePool = 552.28;
        seaLevelDelta = 0;
        bodyOfWaterName = "Wheeler";
        elevURL = "http://r7j8v4x4.map2.ssl.hwcdn.net/WEH_O.xml?1545585488936";
        flowURL = "none"
        dataTVA();
        break;

    case "wilson": // Alabama
        lakePool = 509.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Wilson"
        elevURL = "http://r7j8v4x4.map2.ssl.hwcdn.net/WLH_O.xml?1545585733788";
        flowURL = "none"
        dataTVA();
        break;

    case "wattsbar": // Alabama
        lakePool = 741.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Watts Bar"
        elevURL = "http://r7j8v4x4.map2.ssl.hwcdn.net/WBH_O.xml?1545586001367";
        flowURL = "none"
        dataTVA();
        break;

    case "douglas": // Tennessee
        lakePool = 990.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Douglas"
        elevURL = "http://r7j8v4x4.map2.ssl.hwcdn.net/DGH_O.xml?1545588002667";
        flowURL = "none"
        dataTVA();
        break;

    case "norman": // North Carolina
        lakePool = 1398.0; // 1398.0ft Level reported as a delta to full pool -100 by Duke Energy
        seaLevelDelta = 1298.0
        bodyOfWaterName = "Norman"
        elevURL = "https://lakes.duke-energy.com/Data/Detail/3_Month/4.txt";
        flowURL = "none"
        dataDuke();
        break;

    case "wylie": // North Carolina
        lakePool = 500.0; // 600.0ft Level reported as a delta to full pool -100 by Duke Energy
        seaLevelDelta = 400.0;
        bodyOfWaterName = "Wylie"
        elevURL = "https://lakes.duke-energy.com/Data/Detail/3_Month/18.txt";
        flowURL = "none"
        dataDuke();
        break;

    case "rhodhiss": // North Carolina
        lakePool = 985.0; // 995.1.0ft Level reported as a delta to full pool -100 by Duke Energy
        seaLevelDelta = 885.0;
        bodyOfWaterName = "Rhodhiss"
        elevURL = "https://lakes.duke-energy.com/Data/Detail/3_Month/14.txt";
        flowURL = "none"
        dataDuke();
        break;

    case "jameslake": // North Carolina
        lakePool = 1200.0; // 1200.0ft Level reported as a delta to full pool -100 by Duke Energy
        seaLevelDelta = 1100;
        bodyOfWaterName = "James"
        elevURL = "https://lakes.duke-energy.com/Data/Detail/3_Month/2.txt";
        flowURL = "none"
        dataDuke();
        break;

    case "hickory": // North Carolina
        lakePool = 935.0; // 935.0ft Level reported as a delta to full pool -100 by Duke Energy
        seaLevelDelta = 835.0;
        bodyOfWaterName = "Hickory"
        elevURL = "https://lakes.duke-energy.com/Data/Detail/3_Month/13.txt";
        flowURL = "none"
        dataDuke();
        break;

    case "wateree": // South Carolina
        lakePool = 225.0; // 225.0ft Level reported as a delta to full pool -100 by Duke Energy
        seaLevelDelta = 125.0
        bodyOfWaterName = "Wateree"
        elevURL = "https://lakes.duke-energy.com/Data/Detail/3_Month/17.txt";
        flowURL = "none"
        dataDuke();
        break;

    case "minnehaha": // Florida
        lakePool = 225.0; // 225.0ft Level reported as a delta to full pool -100 by Duke Energy
        seaLevelDelta = 125.0
        bodyOfWaterName = "Minnehaha"
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02236840&period=PT96H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none"
        elevUSGS();
        break;

    case "tablerock": //Missouri
        lakePool = 915.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Table Rock"
        elevURL = "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1884150&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON";
        dataACE();
        break;

    case "lakeoftheozarks": //Missouri
        lakePool = 659.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Table Rock"
        dailyACEData = true;
        elevURL = "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=5043030&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON";
        dataACE();
        // elevURL = "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=5043030&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON";
        //dataACE();
        break;

    case "istokpoga": // Florida
        lakePool = 39.4;
        seaLevelDelta = 0;
        noACEFlow = true; // ACE HQ json call does not contain any flow data
        dataFromACEIsFucked = true;
        bodyOfWaterName = "Istokpoga"
        elevURL = "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=4069038&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON";
        dataACE();
        break;

    case "talquin": // Florida
        lakePool = 70.0;
        seaLevelDelta = 0;
        noACEFlow = true; // ACE HQ json call does not contain any flow data
        bodyOfWaterName = "Talquin"
        elevURL = "http://waterservices.usgs.gov/nwis/iv/?format=json&sites=02329900&period=PT96H&parameterCd=62614&siteType=LK&siteStatus=all";
        elevUSGS();
        break;

    case "tohopekaliga": // Florida
        lakePool = 58.0;
        seaLevelDelta = 0;
        noACEFlow = true; // ACE HQ json call does not contain any flow data
        bodyOfWaterName = "Tohopekaliga"
        elevURL = "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1074038&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON";
        dataACE();
        break;

    /* case "santarosa": //New Mexico
        lakePool = 360.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Santa Rosa";
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08382810&period=PT96H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "none";
        elevUSGS();
        break; */

    case "smith": // Alabama
        lakePool = 510.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Smith Lake"
        elevURL = "/api/alabama";
        elevAlab();
        break;
    
        case "neelyhenry": // Alabama
        lakePool = 508.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Lake Neely Henry"
        elevURL = "/api/alabama";
        elevAlab();
        break;

        case "loganmartin": // Alabama
        lakePool = 465.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Logan Martin Lake"
        elevURL = "/api/alabama";
        elevAlab();
        break;

        case "lay": // Alabama
        lakePool = 396.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Lay Lake"
        elevURL = "/api/alabama";
        elevAlab();
        break;

        case "weiss": // Alabama
        lakePool = 564.0;
        seaLevelDelta = 0;
        bodyOfWaterName = "Weiss Lake"
        elevURL = "/api/alabama";
        elevAlab();
        break;

}