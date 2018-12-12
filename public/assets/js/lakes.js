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

// Function to make flow USGS call
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
                let date = splitTimeDate[0];
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


// Function to make Kerr ACE call
function kerrFlowACE() {
    $.ajax({
        url: "/api/kerr",
        method: "GET"
    })
        .then(function (data) {
            console.log(data);
            // Check if date matches 

            let i = 0;
            data.forEach(function (element) {
                $("#lakeWell-" + i + 1).append("<td>" + element.outflow + "</td>");
                i++;
            })
        });
}

// Function to make flow USGS call
function kerrElevFlow() {
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
                let date = splitTimeDate[0];
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
            kerrFlowACE();
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
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02079490&period=PT72H&parameterCd=62614&siteType=LK&siteStatus=all";
        kerrElevFlow();
        break;

    case "falls":
        lakePool = 252;
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02087182&period=PT72H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02087183&period=PT72H&parameterCd=00060&siteType=ST&siteStatus=all";
        elevUSGS();
        break;

    case "jordan":
        lakePool = 216.5;
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02098197&period=PT72H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02098206&period=PT72H&parameterCd=00060&siteType=ST&siteStatus=all";
        elevUSGS();
        break;

    case "murray":
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02168500&period=PT72H&parameterCd=00060&siteType=LK&siteStatus=all";

        break;

    default:
        alert("Lake name does not exists");
}