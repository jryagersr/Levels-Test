
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
            let currentElev = parseFloat(dataValues[0].value).toFixed(2);
            let splitTimeDate = dataValues[0].dateTime.split("T");
            let currentDate = splitTimeDate[0];
            let currentTime = splitTimeDate[1].substring(0, 5);
            // Set date, time and elev on page
            $("#currentTime").append(currentTime);
            $("#currentDate").append(currentDate);
            $("#currentLevel").append(currentElev);
            // Create our increment and loop through each value
            // For each value create our associated table html
            let i = 0;
            dataValues.forEach(function (element) {
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
            })
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
            // Set current flow on page
            $("#currentLevel").append(dataValues[0].value);
            // Create our increment and loop through the data
            // For each loop append the flow html into the table that already exists
            let i = 0;
            dataValues.forEach(function (element) {
                let flow = element.value;
                $("#lakeWell-" + i + 1).append("<td>" + flow + "</td>");
                i++;
            })
        });
}


// Function to make Kerr ACE call
function kerrFlowACE() {
    $.ajax({
        url: "/api/kerr",
        method: "GET"
    })
        .then(function (data) {
            console.log(data);
            let i = 0;
            data.forEach(function (element) {
                $("#lakeWell-" + i + 1).append("<td>" + element + "</td>");
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
            // Set date, time and elev on page
            $("#currentTime").append(currentTime);
            $("#currentDate").append(currentDate);
            $("#currentLevel").append(currentElev);
            // Create our increment and loop through each value
            // For each value create our associated table html
            let i = 0;
            dataValues.forEach(function (element) {
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
            })
        kerrFlowACE();
        })
}




// Switch to set our api urls based on lake name
// Run corresponding api calls
switch (lakeName) {

    case "kerr":
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02079490&period=PT72H&parameterCd=62614&siteType=LK&siteStatus=all";
        kerrElevFlow();
        break;

    case "falls":
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02087182&period=PT72H&parameterCd=00065&siteType=LK&siteStatus=all";
        flowURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02087183&period=PT72H&parameterCd=00060&siteType=ST&siteStatus=all";
        elevUSGS()
        break;

    case "jordan":
        elevURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02098197&period=PT72H&parameterCd=62614&siteType=LK&siteStatus=all";
        flowURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02098206&period=PT72H&parameterCd=00060&siteType=ST&siteStatus=all";
        elevUSGS();
        break;

    default:
        alert("Lake name does not exists");
}