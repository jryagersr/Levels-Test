// Pull the lake name from the end of the current URL
let parsedURL = window.location.href.split("/");
let lakeRoute = parsedURL[parsedURL.length - 1];

// Clear old page data if it exists
$("#lakeTitle #currentLevel #currentDateTime #lakeSection").empty();

// Hide loader gif
function hideLoader() {
    $('#lds-ring').hide();
}

// Hide loader gif after 20 seconds if page content hasn't loaded
setTimeout(hideLoader, 20 * 1000);

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
    buildElevChart(data);
}

// Function to build chart on page
function buildElevChart(data, lake) {
    // Our data must be parsed into separate flat arrays for the chart
    let labelBatch = [];
    let dataElevBatch = [];
    let dataNPBatch = []; // Storage for Normal Pool batch data
    let dataFCBatch = []; // Storage for Top of Flood Control batch data
    let dataTDBatch = []; // Storage for Top of Flood Control batch data
    let sumOfElevs = 0;
    let divisor = 1;
    let k = 0; // our iterator after starting elevation
    let chartMinElev = 100000; // y-axis Max elev value
    let chartMaxElev = 0; // y-axis Min elev value
    let chartMinElevLimit = 0; // y-axis Min elev Limit (for chart)
    let chartMaxElevLimit = 0; // y-axis Max elev Limit (for chart)
    // find our starting elevation
    for (var i = 0; data.length; i++) {
        if (typeof data[i].elev == "number") {
            sumOfElevs = data[i].elev
            k = i;
            break;
        }
    }
    // Loop through our data for 24 data points if we have it
    for (k; k < data.length; k++) {
        // if we're past the first entry
        if (k > 0) {
            // if we're still on the same day and not on the last entry
            if (data[k].date === data[k - 1].date) {
                // add to our average variables
                sumOfElevs += data[k].elev;
                divisor++
            }
            // else we're on a new day. so push data and reset averages
            else {
                if ((sumOfElevs / divisor) > chartMaxElev) // if value is greater than max, replace max
                    chartMaxElev = sumOfElevs / divisor; // update Max Elev average
                if ((sumOfElevs / divisor) < chartMinElev) // if value is less thank min, replace min
                    chartMinElev = sumOfElevs / divisor; // update Min Elev average
                labelBatch.push(data[k - 1].date);
                dataElevBatch.push((sumOfElevs / divisor).toFixed(2)); // calculate average
                dataNPBatch.push(lake.normalPool); // Normal Pool line batch 
                dataFCBatch.push(lake.topOfFloodControl); // Top of Flood Control Pool line batch
                dataTDBatch.push(lake.topOfDam); // Top of Dam line batch

                sumOfElevs = data[k].elev;
                divisor = 1;
            }
        }
        // when a week of data has been reached stop
        if (labelBatch.length > 10) {
            break;
        }
    }
    // push the final day's values after looping
    labelBatch.push(data[k - 1].date); // put final day date value in array
    dataElevBatch.push((sumOfElevs / divisor).toFixed(2)); // calculate average final day and push
    dataNPBatch.push(lake.normalPool); // Normal Pool line batch (currently trying to get it to display)
    dataFCBatch.push(lake.topOfFloodControl); // Normal Pool line batch (currently trying to get it to display)
    dataTDBatch.push(lake.topOfDam); // Top of Dam line batch (currently trying to get it to display)

    //check the final day's values for Min and MaxLimit
    if ((sumOfElevs / divisor) > chartMaxElev) // if value is greater than max, replace max
        chartMaxElev = sumOfElevs / divisor; // update Max Elev average
    if ((sumOfElevs / divisor) < chartMinElev) // if value is less thank min, replace min
        chartMinElev = sumOfElevs / divisor; // update Min Elev average

    labelBatch.reverse();
    dataElevBatch.reverse();

    // Set y axis limits for Flow Chart
    chartMinElevLimit = Math.round(chartMinElev) - 3; // set the chart lower limit
    if (chartMinElevLimit > lake.normalPool) chartMinElevLimit = lake.normalPool - 2; // make sure normal pool line shows.
    chartMaxElevLimit = Math.round(chartMaxElev) + 3; // set the chart upper limit
    if (chartMaxElevLimit < lake.normalPool) chartMaxElevLimit = lake.normalPool + 2; // make sure normal pool line shows.

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
                    type: 'line',
                    label: "Level",
                    // backgroundColor: 'rgb(179,221,255)',
                    borderColor: 'rgb(0, 140, 255)',
                    data: dataElevBatch
                },
                {
                    type: 'line',
                    label: "Normal Pool",
                    // backgroundColor: 'rgb(179,221,255)',
                    borderColor: 'rgb(100, 140, 100)',
                    data: dataNPBatch,
                    tension: 0 // disables bezier curves
                },
                {
                    type: 'line',
                    label: "Top Flood",
                    // backgroundColor: 'rgb(179,221,255)',
                    borderColor: 'rgb(172, 83, 83)',
                    data: dataFCBatch,
                    tension: 0 // disables bezier curves
                },
                {
                    label: "Top of Dam",
                    // backgroundColor: 'rgb(179,221,255)',
                    borderColor: 'rgb(0, 0, 0)',
                    data: dataTDBatch,
                    tension: 0 // disables bezier curves
                }
            ]
        },

        // Configuration options go here
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Date',
                        fontSize: 20
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Level (feet)',
                        fontSize: 20,
                    },
                    ticks: {
                        min: chartMinElevLimit, // Set chart bottom at 1ft less than min elev value
                        max: chartMaxElevLimit, // Set chart top at 1ft more than min elev value
                        //stepSize: Math.round((chartMaxElev - chartMinElev) / 2), // Set the y-axis step value to  ft.
                        //autoSkip: true,
                        //maxTicksLimit: 8,
                    },
                    stacked: false
                }]
            }
        }
    });
}

// Function to build flow chart on page
function buildFlowChart(data) {
    $("#flowChart").show();
    // Our data must be parsed into separate flat arrays for the chart
    let labelBatch = [];
    let dataFlowBatch = [];
    let sumOfFlows = 0;
    let divisor = 1;
    let k = 0; // our iterator after starting flow
    let chartMinFlow = 1000000; // y-axis Max elev value
    let chartMaxFlow = 0; // y-axis Min elev value
    let chartMinFlowLimit = 0; // y-axis Min elev value
    let chartMaxFlowLimit = 0; // y-axis Max elev value
    // find our starting flow
    for (var i = 0; data.length; i++) {
        if (typeof data[i].flow == "number") {
            sumOfFlows = data[i].flow
            k = i;
            break;
        }
    }
    // Loop through our data for 24 data points if we have it
    for (k; k < data.length; k++) {
        // if we're past the first entry
        if (k > 0) {
            // if the data is available and not "Missing" or "N/A"
            if (data[k].flow !== "Missing" && data[k].flow !== "N/A") {
                // if we're still on the same day and not on the last entry
                if (data[k].date === data[k - 1].date) {
                    // add to our average variables
                    sumOfFlows += data[k].flow;
                    divisor++
                }
                // else we're on a new day. so push data and reset averages
                else {
                    let avgFlow = sumOfFlows / divisor;
                    if (avgFlow >= chartMaxFlow) // if value is greater than max, replace max
                        chartMaxFlow = avgFlow; // set the max flow for calculating Chart y-axis Max later
                    //if (avgFlow <= chartMinFlow) // if value is less thank min, replace min
                        //chartMinFlow = avgFlow; // set the max flow for calculating Chart y-axis Min later
                    labelBatch.push(data[k - 1].date);
                    dataFlowBatch.push((sumOfFlows / divisor).toFixed(2)); // calculate average
                    sumOfFlows = data[k].flow;
                    divisor = 1;
                }
            }
        }
        // when a week of data has been reached stop
        if (labelBatch.length > 10) {
            break;
        }
    }
    // push the final day's values after looping
    labelBatch.push(data[k - 1].date); // Push final day data Date
    dataFlowBatch.push((sumOfFlows / divisor).toFixed(2)); // calculate average for final day and push

    //check the final day's values for Min and MaxLimit
    //if ((sumOfFlows / divisor) <= chartMinFlow)
        //chartMinFlow = (sumOfFlows / divisor);
    if ((sumOfFlows / divisor) >= chartMaxFlow)
        chartMaxFlow = (sumOfFlows / divisor);

    labelBatch.reverse();
    dataFlowBatch.reverse();

    // Set y axis limits for Flow Chart
    chartMinFlowLimit = chartMinFlow - 1000; // set lower chart limit
    chartMaxFlowLimit = ((((chartMaxFlow - (chartMaxFlow % 1000)) / 1000) * 1.2) * 1000); // set the chart upper limit

    //if (chartMinFlowLimit < 1000) chartMinFlowLimit = 0;
    chartMinFlowLimit = 0; // Flow Min limit should just be set to 0
    if (chartMaxFlowLimit < 4000)
        chartMaxFlowLimit = 4000;


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
                        display: false,
                        labelString: 'Date',
                        fontSize: 20
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Flow (feet)',
                        fontSize: 20
                    },
                    ticks: {
                        min: chartMinFlowLimit, // Set chart bottom at calculated value
                        max: chartMaxFlowLimit, // Set chart top at calculated value
                        //stepSize: 6, // Set the y-axis step value 
                        //autoSkip: true,
                        //maxTicksLimit: 8,
                    }
                }]
            }
        }
    });
}

// Get current lake from database
// Declare variable to hold currentLake object
var currentLake = {};
$.ajax({
        url: "/api/find-one-lake",
        method: "GET",
        data: {
            lakeName: lakeRoute
        }
    })
    .then(function (data) {
        currentLake = data;
        // Set lake title on page
        $("#lakeTitle").append(currentLake.bodyOfWater);
        $("#lakeSponsor").append(currentLake.bodyOfWater);
        $("#lakeFeaturedTournament").append(currentLake.bodyOfWater);

        if (currentLake.data.length > 0) {
            currentLake.data.forEach(function (entry, i) {
                let timestamp = new Date(entry.time);
                entry.date = timestamp.toLocaleDateString();
                entry.time = timestamp.toLocaleTimeString();
                if (entry.elev !== "N/A" && entry.elev !== "Missing") {
                    entry.elev = Number(entry.elev);
                }
                if (entry.flow !== "N/A" && entry.flow !== "Missing") {
                    entry.flow = Number(entry.flow);
                }
                // Create the HTML Well (Section) and Add the table content for each reserved table
                var lakeSection = $("<tr>");
                lakeSection.addClass("well");
                lakeSection.attr("id", "lakeWell-" + i + 1);
                $("#lakeSection").append(lakeSection);

                // Append the data values to the table row
                $("#lakeWell-" + i + 1).append("<td>" + entry.date + "</td>");
                $("#lakeWell-" + i + 1).append("<td>" + entry.time + "</td>");
                $("#lakeWell-" + i + 1).append("<td>" + entry.elev + "</td>");
                $("#lakeWell-" + i + 1).append("<td>" + entry.flow + "</td>");
            })

            // build elevation chart
            buildElevChart(currentLake.data, currentLake);

            // build flow chart if flows are available
            if (currentLake.data[0].flow !== "N/A") {
                buildFlowChart(currentLake.data);
            }


            // Hide loading gif
            hideLoader();

            // Set current date, time elev, and pool on page
            $("#currentTime").append(currentLake.data[0].time);
            $("#currentDate").append(currentLake.data[0].date);
            $("#currentLevel").append(currentLake.data[0].elev);
            $("#currentDelta").append((currentLake.data[0].elev - currentLake.normalPool).toFixed(2));
            $("#currentNormal").append("normal pool " + currentLake.normalPool);
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