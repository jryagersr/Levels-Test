let lakePool = 0;

// Function to capitalize first letter of string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Set variable to handle lake name we passed through cookie
// let lakeSelect = getCookie("lakeSelect");

// Clear old page data if it exists
$("#lakeTitle").empty();
$("#currentLevel").empty();
$("#currentDateTime").empty();
$("#lakeSection").empty();


// Pull the lake name from the end of the current URL
let currentURL = window.location.href;
let parsedURL = window.location.href.split("/");
let lakeName = parsedURL[parsedURL.length - 1];
parsedURL = parsedURL.slice(0, parsedURL.length - 2);
let newURL = parsedURL.join("/") + "/api/lakes/" + lakeName
const batch = [];
let elevCheck = false;
let flowCheck = false;

// Function to make elevation USGS call
function elevUSGS() {
    // API call for flow
    $.ajax({
            url: elevURL,
            method: "GET",
        })
        .then(function (data) {
            console.log(data);
            // Set lake title on page
            $("#lakeTitle").append(capitalizeFirstLetter(lakeName));
            // Parse the json data return to find the values we want
            let dataValues = data.value.timeSeries[0].values[0].value
            // Reverse the order of our data so most recent date is first
            dataValues.reverse();
            // Get current Date, Time and Elev
            var currentElev = dataValues[0].value;
            let splitTimeDate = dataValues[0].dateTime.split("T");
            let currentDate = splitTimeDate[0];
            let currentTime = splitTimeDate[1].substring(0, 5);
            let currentDelta = (currentElev - lakePool).toFixed(2);
            // Set date, time and elev on page
            $("#currentTime").append(currentTime);
            $("#currentDate").append(currentDate);
            $("#currentLevel").append(currentElev);
            $("#currentDelta").append(currentDelta);

            // Find first time value that is at the top of the hour
            switch (dataValues[0].dateTime.substring(14, 16)) {

                case "00":
                    var j = 0;
                    break;

                case "15":
                    var j = 1;
                    break;

                case "30":
                    var j = 2
                    break;

                case "45":
                    var j = 3
                    break;

                default:
                    alert("Lake name does not exists");
            }
            // Create our increment and loop through each value
            // For each value create our associated table html
            let i = 0;
            for (j; j < dataValues.length; j += 4) {
                let element = dataValues[j];
                let elev = element.value;
                let splitTimeDate = element.dateTime.split("T");
                let date = splitTimeDate[0].substring(2, 10).replace('-', ' ');
                let time = splitTimeDate[1].substring(0, 5);

                // Create the HTML Well (Section) and Add the table content for each reserved table
                var lakeSection = $("<tr>");
                lakeSection.addClass("well");
                lakeSection.attr("id", "lakeWell-" + i + 1);
                $("#lakeSection").append(lakeSection);

                // Append the data values to the table row
                $("#lakeWell-" + i + 1).append("<td>" + date + "</td>");
                $("#lakeWell-" + i + 1).append("<td>" + time + "</td>");
                $("#lakeWell-" + i + 1).append("<td>" + elev + "</td>");
                i++;

            }
            flowUSGS();
        })
}

// Function to make flow USGS call
function flowUSGS() {
    // API call for flow
    $.ajax({
            url: flowURL,
            method: "GET",
        })
        .then(function (data) {
            console.log(data);
            // Parse through the json data to find the values we want
            let dataValues = data.value.timeSeries[0].values[0].value
            // Reverse the order of our data so most recent date is first
            dataValues.reverse();
            // Create our increment and loop through the data
            // For each loop append the flow html into the table that already exists
            let i = 0;
            dataValues.forEach(function (element) {
                $("#lakeWell-" + i + 1).append("<td>" + element.value + "</td>");
                i++;
            })
        });
}

// function displayData() {

//     batch.forEach(function (element) {
//         // Create the HTML Well (Section) and Add the table content for each reserved table
//         var lakeSection = $("<tr>");
//         lakeSection.addClass("well");
//         lakeSection.attr("id", "lakeWell-" + i + 1);
//         $("#lakeSection").append(lakeSection);

//         // Append the data values to the table row
//         $("#lakeWell-" + i + 1).append("<td>" + element.date + "</td>");
//         $("#lakeWell-" + i + 1).append("<td>" + element.time + "</td>");
//         $("#lakeWell-" + i + 1).append("<td>" + element.elev + "</td>");
//         $("#lakeWell-" + i + 1).append("<td>" + element.flow + "</td>");
//     })
// }


// Function to make ACE flow data call
function flowACE(dataTables) {
    $.ajax({
            url: "/api/"+lakeName,
            method: "GET"
        })
        .then(function (data) {

            // Check if date matches 
            // Find first element in USGS data in which the time value that is at the top of the hour
            switch (dataTables[0].dateTime.substring(14, 16)) {

                case "00":
                    var j = 0;
                    break;

                case "15":
                    var j = 1;
                    break;

                case "30":
                    var j = 2
                    break;

                case "45":
                    var j = 3
                    break;

                default:
                    alert("Lake name does not exists");
            }


            let i = 0;
            let k = 0;
            let aceTime = '0000'; // Time on current ACE line
            let usgsTime = '0'; // Time on current USGS line

            // Code readability, will be set to comparison of times in loop
            let timesAreNotEqual = false;
            let aceTimeGreater = false;
            let monthsAreEqual = false;
            let dataIsLinedUpByDate = false;

            // Check to see if the first ACE flow data line is same time as USGS first line time and the same day 
            // (don't care about month right now)
            // Can fix the month problem later 
            //(only an issue when site down as time goes by midnight last day of month)

            for (j; j < dataTables.length; j += 4) {
                data[i].time = data[i].time.substr(0,2).concat("00")
                if (data[i].time === '2400') { // ACE represents midnight as 2400 of passing day, Jordan Lake on "0031"
                    aceTime = '0000' // USGS represents midnight as 0000 of next day (Dates are different)
                } else aceTime = data[i].time.replace("31",'00');

                usgsTime = dataTables[j].dateTime.substring(11, 16).replace(':', ''); // Pulls the USGS time from the line and removes the : (ACE does not have a colon)

                // Set Booleans for conditionals below, months have OR due to difference in representation of midnight
                timesAreNotEqual = dataTables[j].dateTime.substring(11, 16).replace(':', '') !== aceTime;
                aceTimeGreater = parseInt(dataTables[j].dateTime.substring(11, 16).replace(':', ''), 10) < parseInt(aceTime, 10);
                monthsAreEqual = (data[i].date.substring(0, 2) == dataTables[j].dateTime.substring(8, 10)) || aceTime == '0000';
                let element = data[i]; // define element for template updates below.

                if (monthsAreEqual || dataIsLinedUpByDate) {
                    if (timesAreNotEqual) {
                        if (aceTimeGreater) { // is ACE Time newer than USGS (ACE has newer data?)
                            j = j - 4; // Stay on current USGS line by decrementing loop counter
                            k++; // Stay on current LakeWell Template line
                        } else { // ACE Time is less than USGS Time (ACE site down)


                            $("#lakeWell-" + (i - k) + 1).append("<td>" + "N/A" + "</td>"); //Append N/A as the Flow Value to the row for the missing data
                            i--; // Stay on current ACE line by decrementing index
                            k--; //Move to next Lakewell Template line
                        }
                    } else { // Times are equal, post data to Lakewell template

                        $("#lakeWell-" + (i - k) + 1).append("<td>" + element.outflow + "</td>");
                        dataIsLinedUpByDate = true;
                    }
                }

                i++; // Increment loop counter ACE data and LakeWell template
            }
        });
}

// Function to make flow USGS call
function elevAce() {
    // API call for flow
    $.ajax({
            url: elevURL,
            method: "GET",
        })
        .then(function (data) {
            // Set lake title on page
            $("#lakeTitle").append(capitalizeFirstLetter(lakeName));
            // Parse the json data return to find the values we want
            let dataValues = data.value.timeSeries[0].values[0].value
            // Reverse the order of our data so most recent date is first
            dataValues.reverse();
            // Get current Date, Time and Elev
            let currentElev = parseFloat(dataValues[0].value).toFixed(2);
            let splitTimeDate = dataValues[0].dateTime.split("T");
            let currentDate = splitTimeDate[0];
            let currentTime = splitTimeDate[1].substring(0, 5);
            let currentDelta = (currentElev - lakePool).toFixed(2);

            // Set date, time and elev on page
            $("#currentTime").append(currentTime);
            $("#currentDate").append(currentDate);
            $("#currentLevel").append(currentElev);
            $("#currentDelta").append(currentDelta);


            // Find first element in USGS data in which the time value that is at the top of the hour
            switch (dataValues[0].dateTime.substring(14, 16)) {

                case "00":
                    var j = 0;
                    break;

                case "15":
                    var j = 1;
                    break;

                case "30":
                    var j = 2
                    break;

                case "45":
                    var j = 3
                    break;

                default:
                    alert("Lake name does not exists");
            }

            // Create our increment and loop through each value
            // For each value create our associated table html
            let i = 0;
            for (j; j < dataValues.length; j += 4) {
                let element = dataValues[j];
                let elev = element.value;

                let date = element.dateTime.substring(2, 10).replace('-', ' ');
                let time = element.dateTime.substring(11, 16);

                // Create the HTML Well (Section) and Add the table content for each reserved table
                var lakeSection = $("<tr>");
                lakeSection.addClass("well");
                lakeSection.attr("id", "lakeWell-" + i + 1);
                $("#lakeSection").append(lakeSection);

                // Append the data values to the table row

                $("#lakeWell-" + i + 1).append("<td>" + date + "</td>");
                $("#lakeWell-" + i + 1).append("<td>" + time + "</td>");
                $("#lakeWell-" + i + 1).append("<td>" + elev + "</td>");
                i++;
            }
            flowACE(dataValues);
        })
}


// function getData() {
//     if (elevUSGSCheck === "true") {
//         elevUSGS();
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



// Switch to set our api urls based on lake name
// Run corresponding api calls
switch (lakeName) {

    case "kerr":
        lakePool = 300;
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02079490&period=PT96H&parameterCd=62614&siteType=LK&siteStatus=all";
        elevAce();
        break;

    case "falls":
        lakePool = 252;
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02087182&period=PT96H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02087183&period=PT96H&parameterCd=00060&siteType=ST&siteStatus=all";
        elevUSGS();
        break;

    case "jordan":
        lakePool = 216.5;
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02098197&period=PT96H&parameterCd=62614&siteType=LK&siteStatus=all";
        elevAce();
        break;

    case "murray":
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02168500&period=PT96H&parameterCd=00060&siteType=LK&siteStatus=all";

        break;

    default:
        alert("Lake name does not exists");
}