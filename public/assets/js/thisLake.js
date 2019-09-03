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


/******************************************************************************************************************/
// Function to build table on page
// buildTable function is no longer called
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
    buildElevChart(data); // Why is this here?
}


/******************************************************************************************************************/
// Function to build chart on page
function buildElevChart(data, lake) {
    $("#elevChart").show();
    // Our data must be parsed into separate flat arrays for the chart
    let labelBatch = [];
    let dataElevBatch = [];
    let dataNPBatch = []; // Storage for Normal Pool batch data
    let dataFCBatch = []; // Storage for Top of Flood Control batch data
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
                labelBatch.push(data[k - 1].date.substring(0, data[k - 1].date.length - 5));
                dataElevBatch.push((sumOfElevs / divisor).toFixed(2)); // calculate average
                dataNPBatch.push(lake.normalPool); // Normal Pool line batch 
                dataFCBatch.push(lake.topOfFloodControl); // Top of Flood Control Pool line batch
                //dataTDBatch.push(lake.topOfDam); // Top of Dam line batch

                sumOfElevs = data[k].elev;
                divisor = 1;
            }
        }
        // when a week of data has been reached stop
        if (labelBatch.length > 9) {
            break;
        }
    }
    // push the final day's values after looping
    labelBatch.push(data[k - 1].date.substring(0, data[k - 1].date.length - 5)); // put final day date value in array
    dataElevBatch.push((sumOfElevs / divisor).toFixed(2)); // calculate average final day and push
    dataNPBatch.push(lake.normalPool); // Normal Pool line batch 
    dataFCBatch.push(lake.topOfFloodControl); // Normal Pool line batch 
    //dataTDBatch.push(lake.topOfDam); // Top of Dam line batch 

    //check the final day's values for Min and MaxLimit
    if ((sumOfElevs / divisor) > chartMaxElev) // if value is greater than max, replace max
        chartMaxElev = sumOfElevs / divisor; // update Max Elev average
    if ((sumOfElevs / divisor) < chartMinElev) // if value is less thank min, replace min
        chartMinElev = sumOfElevs / divisor; // update Min Elev average

    labelBatch.reverse();
    dataElevBatch.reverse();

    // Set y axis limits for Elev Chart
    let minMaxDiff = chartMaxElev - chartMinElev;
    let chartGap = (minMaxDiff + 5) * .2;
    if (minMaxDiff < 1) chartGap = minMaxDiff + 1;
    if (minMaxDiff > 20) chartGap = 1;
    chartMinElevLimit = Math.round(chartMinElev) - Math.round(chartGap); // set the chart lower limit
    //if (chartMinElevLimit > lake.normalPool) chartMinElevLimit = lake.normalPool - .5; // make sure normal pool line shows.
    chartMaxElevLimit = Math.round(chartMaxElev) + Math.round(chartGap); // set the chart upper limit
    //if (chartMaxElevLimit < lake.normalPool) chartMaxElevLimit = lake.normalPool + .5; // make sure normal pool line shows.

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
                    label: "Normal",
                    // backgroundColor: 'rgb(179,221,255)',
                    borderColor: 'rgb(100, 140, 100)',
                    data: dataNPBatch,
                    tension: 0 // disables bezier curves
                },
                {
                    type: 'line',
                    label: "Flood",
                    // backgroundColor: 'rgb(179,221,255)',
                    borderColor: 'rgb(172, 83, 83)',
                    data: dataFCBatch,
                    tension: 0 // disables bezier curves
                },
                /* {
                     label: "Top of Dam",
                     // backgroundColor: 'rgb(179,221,255)',
                     borderColor: 'rgb(0, 0, 0)',
                     data: dataTDBatch,
                     tension: 0 // disables bezier curves
                 }*/
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
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 12,
                        fontSize: 10
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Feet (MSL)',
                        fontSize: 14,
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



/******************************************************************************************************************/
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
    let avgFlow = 0;
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
                    avgFlow = sumOfFlows / divisor;
                    if (avgFlow >= chartMaxFlow) // if value is greater than max, replace max
                        chartMaxFlow = avgFlow; // set the max flow for calculating Chart y-axis Max later
                    // no chartMinFlow, always 0
                    labelBatch.push(data[k - 1].date.substring(0, data[k - 1].date.length - 5));
                    dataFlowBatch.push((sumOfFlows / divisor).toFixed(2)); // calculate average
                    sumOfFlows = data[k].flow;
                    divisor = 1;
                }
            }
            if ((data[k].flow == "Missing" || data[k].flow == "N/A") && data[k].date !== data[k - 1].date) {
                labelBatch.push(data[k - 1].date.substring(0, data[k - 1].date.length - 5));
                dataFlowBatch.push((sumOfFlows / divisor).toFixed(2)); // calculate average

                if (data[k].date !== data[k - 1].date) {
                    // if we are here, this lake has a plethora of "Missing" and "N/A"
                    // andthe date has changed between entries,
                    // we must set the chartMaxFlow 
                    avgFlow = sumOfFlows / divisor;
                    if (avgFlow >= chartMaxFlow) // if value is greater than max, replace max
                        chartMaxFlow = avgFlow; // set the max flow for calculating Chart y-axis Max later
                    // no chartMinFlow, always 0
                }
                if ((data[k].flow == "Missing" || data[k].flow == "N/A"))
                    sumOfFlows = 0
                else sumOfFlows = data[k].flow;
                divisor = 1;
            } else if (data[k].date !== data[k - 1].date) {
                // dates are different and flow has good data so, set chartMaxFlow
                if (avgFlow >= chartMaxFlow) // if value is greater than max, replace max
                    chartMaxFlow = avgFlow; // set the max flow for calculating Chart y-axis Max later
                // no chartMinFlow, always 0
            }
        }
        // when a week of data has been reached stop
        if (labelBatch.length > 6) {
            break;
        }
    }
    // push the final day's values after looping
    labelBatch.push(data[k - 1].date.substring(0, data[k - 1].date.length - 5)); // Push final day data Date
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
                        labelString: 'Time',
                        fontSize: 20
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 12,
                        fontSize: 10
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Cubic Ft/Second',
                        fontSize: 14
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

/******************************************************************************************************************/
// Function to build chart on page
// Actually Hourly Elevation but called River because it can show daily tides on a River
function buildRiverChart(data, lake) {
    $("#riverChart").show();
    // Our data must be parsed into separate flat arrays for the chart
    let labelBatch = [];
    let dataRiverBatch = [];
    let k = 0; // our iterator after starting elevation
    let chartMinRiver = 100000; // y-axis Max elev value
    let chartMaxRiver = 0; // y-axis Min elev value
    let chartMinRiverLimit = 0; // y-axis Min elev Limit (for chart)
    let chartMaxRiverLimit = 0; // y-axis Max elev Limit (for chart)
    // find our starting elevation
    for (var i = 0; data.length; i++) {
        if (typeof data[i].elev == "number") {
            k = i;
            break;
        }
    }
    // Loop through our data for 24 data points if we have it
    for (k; k < data.length; k++) {
        // if we're past the first entry
        if (k > 0) {
            labelBatch.push(data[k - 1].time.substr(0, data[k - 1].time.lastIndexOf(":")) + data[k - 1].time.substr(data[k - 1].time.length - 2, 2));
            dataRiverBatch.push((data[k - 1].elev).toFixed(2)); // push elev

            if (data[k - 1].elev > chartMaxRiver) // if value is greater than max, replace max
                chartMaxRiver = data[k - 1].elev; // update Max Elev average
            if (data[k - 1].elev < chartMinRiver) // if value is less thank min, replace min
                chartMinRiver = data[k - 1].elev; // update Min Elev average

        }
        // when a week of data has been reached stop
        if (labelBatch.length > 23) {
            break;
        }
    }

    labelBatch.reverse();
    dataRiverBatch.reverse();

    // Set y axis limits for River Chart
    let chartGap = chartMaxRiver * .2;
    let minMaxDiff = chartMaxRiver - chartMinRiver;
    if (minMaxDiff < 1)
        chartGap = minMaxDiff * 2;
    else chartGap = minMaxDiff / 2;
    chartMinRiverLimit = Math.round(chartMinRiver) - Math.round(chartGap + 1); // set the chart lower limit
    //if (chartMinElevLimit > lake.normalPool) chartMinElevLimit = lake.normalPool - .5; // make sure normal pool line shows.
    chartMaxRiverLimit = Math.round(chartMaxRiver) + Math.round(chartGap + 1); // set the chart upper limit
    //if (chartMaxElevLimit < lake.normalPool) chartMaxElevLimit = lake.normalPool + .5; // make sure normal pool line shows.

    var ctx = document.getElementById('myRiverChart').getContext('2d');
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
                data: dataRiverBatch
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
                        labelString: 'Time',
                        fontSize: 20
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 12,
                        fontSize: 10
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Feet (MSL)',
                        fontSize: 14,
                    },
                    ticks: {
                        min: chartMinRiverLimit, // Set chart bottom at 1ft less than min elev value
                        max: chartMaxRiverLimit, // Set chart top at 1ft more than min elev value
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

/******************************************************************************************************************/
// Function to build chart on page
function buildHourlyFlowChart(data, lake) {
    $("#hourlyFlowChart").show();
    // Our data must be parsed into separate flat arrays for the chart
    let labelBatch = [];
    let dataFlowBatch = [];
    let k = 0; // our iterator after starting elevation
    let chartMinFlow = 100000; // y-axis Max elev value
    let chartMaxFlow = 0; // y-axis Min elev value
    let chartMinFlowLimit = 0; // y-axis Min elev Limit (for chart)
    let chartMaxFlowLimit = 0; // y-axis Max elev Limit (for chart)
    // find our starting elevation
    for (var i = 0; data.length; i++) {
        if (typeof data[i].flow == "number") {
            k = i;
            break;
        }
    }
    // Loop through our data for 24 data points if we have it
    for (k; k < data.length; k++) {
        // if we're past the first entry
        if (k > 0) {
            if (data[k].flow !== "Missing" && data[k].flow !== "N/A") {
                labelBatch.push(data[k].time.substr(0, data[k].time.lastIndexOf(":")) + data[k].time.substr(data[k].time.length - 2, 2)); // Remove minutes
                dataFlowBatch.push((data[k].flow).toFixed(2)); // push elev

                if (data[k].flow > chartMaxFlow) // if value is greater than max, replace max
                    chartMaxFlow = data[k].flow; // update Max Elev average
                if (data[k].flow < chartMinFlow) // if value is less thank min, replace min
                    chartMinFlow = data[k].flow; // update Min Elev average

            }
        }
        // when a week of data has been reached stop
        if (labelBatch.length > 47) {
            break;
        }
    }

    labelBatch.reverse();
    dataFlowBatch.reverse();

    // Set y axis limits for River Chart
    let chartGap = (chartMaxFlow * .2) + 1;
    let minMaxDiff = chartMaxFlow - chartMinFlow;
    if (minMaxDiff < 1 && minMaxDiff !== 0) chartGap = minMaxDiff * 2;
    chartMinFlowLimit = 0; // set the chart lower limit
    //if (chartMinElevLimit > lake.normalPool) chartMinElevLimit = lake.normalPool - .5; // make sure normal pool line shows.
    chartMaxFlowLimit = Math.round(chartMaxFlow) + Math.round(chartGap); // set the chart upper limit
    //if (chartMaxElevLimit < lake.normalPool) chartMaxElevLimit = lake.normalPool + .5; // make sure normal pool line shows.

    var ctx = document.getElementById('myHourlyFlowChart').getContext('2d');
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
                label: "Flow (cfs)",
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
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 12,
                        fontSize: 10
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Cubic Ft/Second',
                        fontSize: 14,
                    },
                    ticks: {
                        min: chartMinFlowLimit, // Set chart bottom at 1ft less than min elev value
                        max: chartMaxFlowLimit, // Set chart top at 1ft more than min elev value
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






/******************************************************************************************************************/
//
//
//               Weather Charts    !!!!!!!!!!!!!!!!!!!!!!!
//
//
/******************************************************************************************************************/
// Function to build temp chart on page
function buildTempChart(tempData) {
    $("#tempChart").show();
    // Our data must be parsed into separate flat arrays for the chart
    let labelBatch = [];
    let dataTempBatch = [];
    let k = 0; // our iterator after starting elevation
    let chartMinTemp = 100000; // y-axis Max elev value
    let chartMaxTemp = 0; // y-axis Min elev value
    let chartMinTempLimit = 0; // y-axis Min elev Limit (for chart)
    let chartMaxTempLimit = 0; // y-axis Max elev Limit (for chart)

    // Loop through our data for 24 data points if we have it
    for (k; k < tempData.ccWxData.length; k++) {
        if (typeof tempData.ccWxData[k].temp == "number") {

            //labelBatch.push(tempData.ccWxData[k - 1].time);

            //calculate the time as 12 hour AM PM.

            let timeStamp = new Date(tempData.ccWxData[k].date);

            //calculate the time as 12 hour AM PM.
            hour = timeStamp.getHours();
            let suffix = "PM";
            if (hour < 12)
                suffix = "AM";
            hour = ((hour + 11) % 12 + 1);

            labelBatch.push(hour + suffix);
            // tempData.ccWxData[k].time.substr(0, tempData.ccWxData[k].time.indexOf("M") - 8) + tempData.ccWxData[k].time.substr(tempData.ccWxData[k].time.indexOf("M") - 1, 2))
            dataTempBatch.push(tempData.ccWxData[k].temp); // push elev

            if (tempData.ccWxData[k].temp > chartMaxTemp) // if value is greater than max, replace max
                chartMaxTemp = tempData.ccWxData[k].temp; // update Max Elev average
            if (tempData.ccWxData[k].temp < chartMinTemp) // if value is less thank min, replace min
                chartMinTemp = tempData.ccWxData[k].temp; // update Min Elev average

        }
        // when a week of data has been reached stop
        if (labelBatch.length > 23 || k > tempData.ccWxData.length - 1) {
            break;
        }
    }

    // Set y axis limits for Temp Chart
    let minMaxDiff = chartMaxTemp - chartMinTemp;
    if (minMaxDiff < 1) chartGap = minMaxDiff / 2;
    chartMinTempLimit = Math.round(chartMinTemp) - 5; // set the chart lower limit
    //if (chartMinElevLimit > lake.normalPool) chartMinElevLimit = lake.normalPool - .5; // make sure normal pool line shows.
    chartMaxTempLimit = Math.round(chartMaxTemp) + 5; // set the chart upper limit
    //if (chartMaxElevLimit < lake.normalPool) chartMaxElevLimit = lake.normalPool + .5; // make sure normal pool line shows.

    var ctx = document.getElementById('myTempChart').getContext('2d');
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
                label: "Temp (F)",
                // backgroundColor: 'rgb(179,221,255)',
                borderColor: 'rgb(0, 140, 255)',
                data: dataTempBatch
            }, ]
        },

        // Configuration options go here
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Time',
                        fontSize: 20
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 12,
                        fontSize: 10
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Deg Fahrenheit',
                        fontSize: 14,
                    },
                    ticks: {
                        min: chartMinTempLimit, // Set chart bottom at 1ft less than min elev value
                        max: chartMaxTempLimit, // Set chart top at 1ft more than min elev value
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

/******************************************************************************************************************/
// Function to build humidity chart on page
function buildHumidityChart(humidityData) {
    $("#humidityChart").show();
    // Our data must be parsed into separate flat arrays for the chart
    let labelBatch = [];
    let dataHumidityBatch = [];
    let k = 0; // our iterator after starting elevation
    let chartMinHumidity = 100000; // y-axis Max elev value
    let chartMaxHumidity = 0; // y-axis Min elev value
    let chartMinHumidityLimit = 0; // y-axis Min elev Limit (for chart)
    let chartMaxHumidityLimit = 0; // y-axis Max elev Limit (for chart)

    // Loop through our data for 24 data points if we have it
    for (k; k < humidityData.ccWxData.length; k++) {

        if (typeof humidityData.ccWxData[k].humidity == "number") { //calculate the time as 12 hour AM PM.

            let timeStamp = new Date(humidityData.ccWxData[k].date);

            //calculate the time as 12 hour AM PM.
            hour = timeStamp.getHours();
            let suffix = "PM";
            if (hour < 12)
                suffix = "AM";
            hour = ((hour + 11) % 12 + 1);

            labelBatch.push(hour + suffix)
            dataHumidityBatch.push(humidityData.ccWxData[k].humidity); // push elev

            if (humidityData.ccWxData[k].humidity > chartMaxHumidity) // if value is greater than max, replace max
                chartMaxHumidity = humidityData.ccWxData[k].humidity; // update Max Elev average
            if (humidityData.ccWxData[k].temp < chartMinHumidity) // if value is less thank min, replace min
                chartMinHumidity = humidityData.ccWxData[k].humidity; // update Min Elev average

        }
        // when a week of data has been reached stop
        if (labelBatch.length > 23 || k > humidityData.ccWxData.length - 1) {
            break;
        }
    }

    // Set y axis limits for Temp Chart
    //if (chartMaxElevLimit < lake.normalPool) chartMaxElevLimit = lake.normalPool + .5; // make sure normal pool line shows.
    chartMinHumidityLimit = 0; // set the chart lower limit
    chartMaxHumidityLimit = 110; // set the chart upper limit

    var ctx = document.getElementById('myHumidityChart').getContext('2d');
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
                label: "Humidity %",
                // backgroundColor: 'rgb(179,221,255)',
                borderColor: 'rgb(0, 140, 255)',
                data: dataHumidityBatch
            }, ]
        },

        // Configuration options go here
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Time',
                        fontSize: 20
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 12,
                        fontSize: 10
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '% Sat',
                        fontSize: 14,
                    },
                    ticks: {
                        min: chartMinHumidityLimit, // Set chart bottom at 1ft less than min elev value
                        max: chartMaxHumidityLimit, // Set chart top at 1ft more than min elev value
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
/******************************************************************************************************************/
// Function to build baro chart on page
function buildBaroChart(baroData) {
    $("#baroChart").show();
    // Our data must be parsed into separate flat arrays for the chart
    let labelBatch = [];
    let dataBaroBatch = [];
    let k = 0; // our iterator after starting elevation
    let chartMinBaro = 100000; // y-axis Max elev value
    let chartMaxBaro = 0; // y-axis Min elev value
    let chartMinBaroLimit = 0; // y-axis Min elev Limit (for chart)
    let chartMaxBaroLimit = 0; // y-axis Max elev Limit (for chart)

    // Loop through our data for 24 data points if we have it
    for (k; k < baroData.ccWxData.length; k++) {

        if (typeof baroData.ccWxData[k].baro == "number") {

            let timeStamp = new Date(baroData.ccWxData[k].date);

            //calculate the time as 12 hour AM PM.
            hour = timeStamp.getHours();
            let suffix = "PM";
            if (hour < 12)
                suffix = "AM";
            hour = ((hour + 11) % 12 + 1);

            labelBatch.push(hour + suffix);
            dataBaroBatch.push(baroData.ccWxData[k].baro); // push elev

            if (baroData.ccWxData[k].baro > chartMaxBaro) // if value is greater than max, replace max
                chartMaxBaro = baroData.ccWxData[k].baro; // update Max Elev average
            if (baroData.ccWxData[k].baro < chartMinBaro) // if value is less thank min, replace min
                chartMinBaro = baroData.ccWxData[k].baro; // update Min Elev average

        }
        // when a week of data has been reached stop
        if (labelBatch.length > 47 || k > baroData.ccWxData.length - 1) {
            break;
        }
    }

    // Set y axis limits for Baro Chart
    let minMaxDiff = chartMaxBaro - chartMinBaro;
    if (minMaxDiff < 1) chartGap = minMaxDiff / 2;
    chartMinBaroLimit = Math.round(chartMinBaro) - 1; // set the chart lower limit
    //if (chartMinElevLimit > lake.normalPool) chartMinElevLimit = lake.normalPool - .5; // make sure normal pool line shows.
    chartMaxBaroLimit = Math.round(chartMaxBaro) + 1; // set the chart upper limit
    //if (chartMaxElevLimit < lake.normalPool) chartMaxElevLimit = lake.normalPool + .5; // make sure normal pool line shows.

    var ctx = document.getElementById('myBaroChart').getContext('2d');
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
                label: "Pressure (mb)",
                // backgroundColor: 'rgb(179,221,255)',
                borderColor: 'rgb(0, 140, 255)',
                data: dataBaroBatch
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
                        labelString: 'Time',
                        fontSize: 20
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 12,
                        fontSize: 10
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Pressure mb',
                        fontSize: 14,
                    },
                    ticks: {
                        min: chartMinBaroLimit, // Set chart bottom at 1ft less than min elev value
                        max: chartMaxBaroLimit, // Set chart top at 1ft more than min elev value
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

/******************************************************************************************************************/
// Function to build Wind Speed chart 
function buildWindChart(windData) {
    $("#windChart").show();
    // Our data must be parsed into separate flat arrays for the chart
    let labelBatch = [];
    let dataWindBatch = [];
    let k = 0; // our iterator after starting wind speed
    let chartMinWind = 100000; // y-axis Max wind speed value
    let chartMaxWind = 0; // y-axis Min wind speed value
    let chartMinWindLimit = 0; // y-axis Min wind speed Limit (for chart)
    let chartMaxWindLimit = 0; // y-axis Max wind speed Limit (for chart)

    // Loop through our data for 24 data points if we have it
    for (k; k < windData.ccWxData.length; k++) {

        if (typeof windData.ccWxData[k].windspeed == "number") {

            let timeStamp = new Date(windData.ccWxData[k].date);

            //calculate the time as 12 hour AM PM.
            hour = timeStamp.getHours();
            let suffix = "PM";
            if (hour < 12)
                suffix = "AM";
            hour = ((hour + 11) % 12 + 1);

            labelBatch.push(hour + suffix);
            dataWindBatch.push(windData.ccWxData[k].windspeed); // push wind speeed

            if (windData.ccWxData[k].windspeed > chartMaxWind) // if value is greater than max, replace max
                chartMaxWind = windData.ccWxData[k].windspeed; // update Max Wind
            if (windData.ccWxData[k].windspeed < chartMinWind) // if value is less thank min, replace min
                chartMinWind = windData.ccWxData[k].windspeed; // update Min Wind

        };
        // when a day of data has been reached stop
        if (labelBatch.length > 23 || k > windData.ccWxData.length - 2) {
            break;
        };
    };

    //labelBatch.reverse();
    //dataWindBatch.reverse();


    // Set y axis limits for Baro Chart
    let chartGap = chartMaxWind * .2;
    let minMaxDiff = chartMaxWind - chartMinWind;
    if (minMaxDiff < 1) chartGap = minMaxDiff / 2;
    chartMinWindLimit = 0; // set the chart lower limit
    chartMaxWindLimit = Math.round(chartMaxWind) + Math.round(chartGap + 1); // set the chart upper limit

    var ctx = document.getElementById('myWindChart').getContext('2d');
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
                label: "Wind Speed (MPH)",
                // backgroundColor: 'rgb(179,221,255)',
                borderColor: 'rgb(0, 140, 255)',
                data: dataWindBatch
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
                        labelString: 'Time',
                        fontSize: 20,
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 12,
                        fontSize: 10
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'MPH',
                        fontSize: 14,
                    },
                    ticks: {
                        min: chartMinWindLimit, // Set chart bottom 
                        max: chartMaxWindLimit, // Set chart top 
                        //stepSize: Math.round((chartMaxElev - chartMinElev) / 2), // Set the y-axis step value to  ft.
                        //autoSkip: true,
                        //maxTicksLimit: 8,
                    },
                    stacked: false
                }]
            }
        }
    });
};

/******************************************************************************************************************/
// Function to build wind direction chart
function buildWindDirectionChart(windData) {
    $("#windDirectionChart").show();
    // Our data must be parsed into separate flat arrays for the chart
    let labelBatch = [];
    let dataWindBatch = [];
    let windDirectionIndex = 0;
    let k = 0; // our iterator after starting data
    let compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    let displayCompassSector = ["N", " ", "NE", " ", "E", " ", "SE", " ", "S", " ", "SW", " ", "W", " ", "NW", " "];



    // Loop through our data for 24 data points if we have it
    for (k; k < windData.ccWxData.length; k++) {

        if (typeof windData.ccWxData[k].winddirection == "string") {

            let timeStamp = new Date(windData.ccWxData[k].date);

            //calculate the time as 12 hour AM PM.
            hour = timeStamp.getHours();
            let suffix = "PM";
            if (hour < 12)
                suffix = "AM";
            hour = ((hour + 11) % 12 + 1);

            labelBatch.push(hour + suffix);
            // check to see if wind direction reported is null
            if (windData.ccWxData[k].winddirection == null) {
                windDirection = 0;

            } else {
                windDirectionIndex = compassSector.indexOf(windData.ccWxData[k].winddirection);
            };
            dataWindBatch.push(windDirectionIndex); // push wind direction

        };
        // when a week of data has been reached stop
        if (labelBatch.length > 23 || k > windData.ccWxData.length - 2) {
            break;
        };
    };

    var ctx = document.getElementById('myWindDirectionChart').getContext('2d');
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
                label: "Direction",
                // backgroundColor: 'rgb(179,221,255)',
                borderColor: 'rgb(0, 140, 255)',
                showLine: false,
                data: dataWindBatch
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
                        labelString: 'Time',
                        fontSize: 20,
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 12,
                        fontSize: 10
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Direction',
                        fontSize: 14,
                    },
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return displayCompassSector[value];
                        },

                        min: 0, // Set chart bottom 
                        max: 16, // Set chart top 
                        stepSize: 1,
                        fontSize: 9,
                        autoSkip: true
                    },
                    stacked: false
                }]
            }
        }
    });
};


// function to flatten the nested data
function flattenData(data, type, callback) {
    flatBatch = [];
    data.forEach(function (element) {
        for (k = 0; k < element.trails.length; k++) {

            for (l = 0; l < element.trails[k].tournaments.length; l++) {
                // Format the tx date to check against today's date
                let txDate = new Date(element.trails[k].tournaments[l].date);
                let todaysDate = new Date();
                // check which page we're on
                if (type == 0) {
                    // If tx date is in the future (exclude all past dates)
                    if (Date.parse(txDate) > Date.parse(todaysDate)) {
                        // Push our data into a flat array for easier sort later
                        flatBatch.push({
                            organizer: element.organization,
                            trail: element.trails[k].trail,
                            date: element.trails[k].tournaments[l].date,
                            lake: element.trails[k].tournaments[l].lake,
                            lakeID: element.trails[k].tournaments[l].lakeID,
                            ramp: element.trails[k].tournaments[l].ramp,
                            state: element.trails[k].tournaments[l].state,
                            entryLink: element.trails[k].tournaments[l].entryLink,
                            resultsLink: element.trails[k].tournaments[l].resultsLink
                        });
                    };
                } else {
                    // If tx date is in the past (exclude all future dates)
                    if (Date.parse(txDate) < Date.parse(todaysDate)) {
                        // Push our data into a flat array for easier sort later
                        flatBatch.push({
                            organizer: element.organization,
                            trail: element.trails[k].trail,
                            date: element.trails[k].tournaments[l].date,
                            lake: element.trails[k].tournaments[l].lake,
                            lakeID: element.trails[k].tournaments[l].lakeID,
                            ramp: element.trails[k].tournaments[l].ramp,
                            state: element.trails[k].tournaments[l].state,
                            entryLink: element.trails[k].tournaments[l].entryLink,
                            resultsLink: element.trails[k].tournaments[l].resultsLink
                        });
                    };
                };
            };
        };
    });
    callback(flatBatch);
};


// Function to sort data by asc/desc
var sort_by = function (field, reverse, primer) {
    var key = primer ?
        function (x) {
            return primer(x[field])
        } :
        function (x) {
            return x[field]
        };
    reverse = !reverse ? 1 : -1;
    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    };
};





/******************************************************************************************************************/
//
//
//
//      Process the PAGE
//
//
//
//
/******************************************************************************************************************/
// Get current lake from database
// Declare variable to hold currentLake object
var currentLake = {};
var rampData = {};
var noDataSource = false;

$.ajax({
        url: "/api/find-one-lake",
        method: "GET",
        data: {
            lakeName: lakeRoute
        }
    })
    .then(function (data) {
        currentLake = data;
        if (currentLake.data.length == 0)
            noDataSource = true

        /***************************************************************************** */
        //Current Tab
        /***************************************************************************** */

        // Set lake title on page
        $("#lakeTitle").append(currentLake.bodyOfWater);

        // Set current date, time elev, and pool on page
        if (!noDataSource) {
            $("#currentTime").append(new Date(currentLake.data[0].time).toString().substr(0, 21));
            $("#currentDate").append(currentLake.data[0].date);
            $("#currentLevel").append(currentLake.data[0].elev);
            $("#currentDelta").append((currentLake.data[0].elev - currentLake.normalPool).toFixed(2));
            $("#currentNormal").append("normal pool " + currentLake.normalPool);
        } else {
            $("#currentLevel").append("No known source for level data");
        };

        $("#lakeSponsor").append(currentLake.bodyOfWater);
        $("#lakeFeaturedTournament").append(currentLake.bodyOfWater);

        // Set the current weather conditions
        let ccIndex = currentLake.ccWxData.length - 1;
        let timeStamp = new Date(currentLake.ccWxData[ccIndex].date);

        //calculate the time as 12 hour AM PM.
        hour = timeStamp.getHours();
        let suffix = "PM";
        if (hour < 12)
            suffix = "AM";
        hour = ((hour + 11) % 12 + 1);
        let ccDate = timeStamp.toLocaleDateString();

        $("#currentWeatherConditions").append(currentLake.ccWxData[ccIndex].conditions);
        $("#currentWeatherTemp").append(currentLake.ccWxData[ccIndex].temp);
        $("#currentWeatherHumidity").append(currentLake.ccWxData[ccIndex].humidity);
        $("#currentWeatherBarometric").append(currentLake.ccWxData[ccIndex].baro);
        $("#currentWeatherWindSpeed").append(currentLake.ccWxData[ccIndex].windspeed);
        $("#currentWeatherWindDirection").append(currentLake.ccWxData[ccIndex].winddirection);
        $("#currentWeatherDate").append(ccDate + " " + hour + suffix);
        $("#currentWeatherTime").append(currentLake.ccWxData[ccIndex].location);

        /***************************************************************************** */
        //Ramp Tab
        /***************************************************************************** */

        // API call for ramp data for Ramps
        $.ajax({
                url: "/api/ramps",
                method: "GET",
            })
            .then(function (data) {
                rampData = data;
                rampData.forEach(function (ramp, i) {
                    // if match send the lat lon to client
                    let rampDirectionsLink = "https://www.google.com/maps/dir//" + ramp.lat + "," + ramp.long;

                    if (ramp.id == lakeRoute) {
                        // Create the HTML Well (Section) and Add the table content for each reserved table
                        var rampSection = $("<tr>");
                        rampSection.addClass("well");
                        rampSection.attr("id", "rampWell-" + i + 1);

                        // Set href as rampDirectionsLink
                        rampSection.attr("data-url", rampDirectionsLink); // Add data attribute to the row with entryLink url
                        rampSection.addClass("clickable-row"); // Add clickable row css styles

                        $("#rampSection").append(rampSection);
                        // Append the data values to the table row
                        $("#rampWell-" + i + 1).append("<td><b>" + ramp.rampName + "</b></td>");
                        $("#rampWell-" + i + 1).append("<td> <a href='" + rampDirectionsLink + "' target='_blank'> Click </a> </td>");
                    };
                });
            });

        /***************************************************************************** */
        // Data Tab
        /***************************************************************************** */

        // Stuff the lakeWell

        if (currentLake.data.length > 0) {
            currentLake.data.forEach(function (entry, i) {
                let timestamp = new Date(entry.time);
                entry.date = timestamp.toLocaleDateString();
                entry.time = timestamp.toLocaleTimeString();
                //remove seconds from time
                entry.time = entry.time.substr(0, entry.time.lastIndexOf(":")) + entry.time.substr(entry.time.length - 2, 2)
                if (entry.elev !== "N/A" && entry.elev !== "Missing") {
                    entry.elev = Number(entry.elev);
                };
                if (entry.flow !== "N/A" && entry.flow !== "Missing") {
                    entry.flow = Number(entry.flow);
                };
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
            });
        };

        /***************************************************************************** */
        // Weather Tab (5 Day/3 Hour) Forecast)
        /***************************************************************************** */

        let wxTableRow = 1;
        let j = 0;
        let i = 0;
        let fxData = currentLake.wxForecastData;
        let saveJStart = 0;
        let saveJEnd = 0;

        //fxdData.reverse();

        let dayLines = [];
        let dataLines = [];

        fxData.forEach(function (element, i) {
            if ((element !== "undefined")) {

                // if the first element or a Day forecast element 
                if (typeof element.day == 'number') {

                    // This is a "Day" Line in the data, we must save it until it is time to push it in the well

                    dayLines.push({
                        conditions: element.conditions,
                        day: element.day,
                        high: element.high,
                        humidity: element.humidity,
                        low: element.low,
                        temp: element.temp,
                        time: element.time,
                        winddirection: element.winddirection,
                        windspeed: element.windspeed
                    });

                } else {
                    // If element is a data line display the line
                    if (typeof element.day !== 'number') {

                        dataLines.push({
                            conditions: element.conditions,
                            humidity: element.humidity,
                            temp: element.temp,
                            time: element.time,
                            winddirection: element.winddirection,
                            windspeed: element.windspeed
                        });
                    };
                };

                // Check to see if time is 00:00 (ie beginning of the day
                // If so, then display the saved day
            };
        });

        /*********************************************************************** */
        // Set the Day High and Low temp to the correct value (calculate)
        //********************************************************************** */

        // We must do this because the high and low temp are set according 
        // to UTC time, which skews the temps and the days.
        for (i = 0; i < dayLines.length - 1; i++) {
            //initialize the high and low temps for the day.
            dayLines[i].high = 0;
            dayLines[i].low = 150;
            // need a place to save local time of last day.
            let lastDataLineTime = 0;

            for (j = saveJStart; j < dataLines.length-1; j++) {

                let weatherLocale = new Date(dataLines[j].time.substr(0, dataLines[j].time.indexOf(" ")) + "T" + dataLines[j].time.substr(dataLines[j].time.indexOf(" ")+1, dataLines[j].time.length) + "Z");
                let weatherLocaleDate = weatherLocale.toLocaleDateString();
                let weatherLocaleTime = weatherLocale.toLocaleTimeString();
                let weatherLocaleHour = weatherLocaleTime.substr(0, weatherLocaleTime.indexOf(0, ":") - 1);
                
            if (weatherLocaleTime.substr(weatherLocaleTime.length - 2, 2) == "PM") {
                timeTest = "PM";
            } else timeTest = "AM"

                // check current dataLine time against previous dataLine time for midnight rollover
                // cannot check date due to change from UTC to local time
                // have to check for when the time rolls over midnight
                if (Number(weatherLocaleHour) > lastDataLineTime || timeTest == "PM") {
                    if (dataLines[j].temp > dayLines[i].high)
                        dayLines[i].high = dataLines[j].temp;
                    if (dataLines[j].temp < dayLines[i].low)
                        dayLines[i].low = dataLines[j].temp;

                } else {
                        saveJEnd = j;
                        j = dataLines.length;
                };
                // save the current dataLine time for the comparison above
                lastDataLineTime = Number(weatherLocaleHour);
            };

            //********************************************************************** */
            // now stuff the Day and Data Lines in the correct order into the well
            //********************************************************************** */

            // // Create the HTML Well (Section) and Add the table content for each reserved table
            let lastDataTimeTest = "";

            // Append the Days remaining forecast to the well
            var weatherSection = $("<tr>");
            weatherSection.addClass("well");
            weatherSection.attr("id", "weatherWell-" + wxTableRow + 1);
            $("#weatherSection").append(weatherSection);

            let weatherLocale = new Date(dataLines[0].time.substr(0, dataLines[0].time.indexOf(" ")) + "T" + dataLines[0].time.substr(dataLines[0].time.indexOf(" ")+1, dataLines[0].time.length) + "Z");
            let weatherLocaleDate = weatherLocale.toLocaleDateString();
            let weatherLocaleTime = weatherLocale.toLocaleTimeString();
            let weatherLocaleHour = weatherLocaleTime.substr(0, weatherLocaleTime.indexOf(0, ":") - 1);

            if (weatherLocaleDate.substr(weatherLocaleDate.length - 2, 2) == "PM") {
                timeTest = "PM";
            } else timeTest = "AM"

            // Append the day lines
            $("#weatherWell-" + wxTableRow + 1).append("<td>" + weatherLocaleDate.substring(0, weatherLocaleDate.length - 5)) + "</td>";
            $("#weatherWell-" + wxTableRow + 1).append("<td>" + "Fcast" + "</td>");
            $("#weatherWell-" + wxTableRow + 1).append("<td>" + dayLines[i].conditions + "</td>");
            $("#weatherWell-" + wxTableRow + 1).append("<td>" + dayLines[i].high.toFixed(0) + '/' + dayLines[i].low.toFixed(0) + "</td>");
            $("#weatherWell-" + wxTableRow + 1).append("<td>" + Math.round(dayLines[i].windspeed) + ' ' + dayLines[i].winddirection + "</td>");

            wxTableRow++;

            weatherLocale = new Date(dataLines[0].time.substr(0, dataLines[0].time.indexOf(" ")) + "T" + dataLines[0].time.substr(dataLines[0].time.indexOf(" ")+1, dataLines[0].time.length) + "Z");
            weatherLocaleDate = weatherLocale.toLocaleDateString();
            weatherLocaleTime = weatherLocale.toLocaleTimeString();
            weatherLocaleHour = weatherLocaleTime.substr(0, weatherLocaleTime.indexOf(0, ":") - 1);

            if (weatherLocaleDate.substr(weatherLocaleDate.length - 2, 2) == "PM") {
                dataTimeTest = "PM";
                lastDataTimeTest = "PM";
            } else {
                dataTimeTest = "AM";
                lastDataTimeTest = "AM";
            };

            for (j = saveJStart; j < saveJEnd + 1; j++) {

                weatherLocale = new Date(dataLines[0].time.substr(0, dataLines[j].time.indexOf(" ")) + "T" + dataLines[j].time.substr(dataLines[j].time.indexOf(" ")+1, dataLines[j].time.length) + "Z");
                weatherLocaleDate = weatherLocale.toLocaleDateString();
                weatherLocaleTime = weatherLocale.toLocaleTimeString();
                weatherLocaleHour = weatherLocaleTime.substr(0, weatherLocaleTime.indexOf(0, ":") - 1);

                let dataTimeTest = weatherLocaleTime.substr(weatherLocaleTime.length - 2, 2);

                if (dataTimeTest == lastDataTimeTest || lastDataTimeTest == "AM") {
                    lastDataTimeTest = dataTimeTest;
                    var weatherSection = $("<tr>");
                    weatherSection.addClass("well");
                    weatherSection.attr("id", "weatherWell-" + wxTableRow + 1);
                    $("#weatherSection").append(weatherSection);

                    let windDirection = dataLines[j].winddirection;
                    if (windDirection == null)
                        windDirection = "N/A";

                    $("#weatherWell-" + wxTableRow + 1).append("<td>" + " " + "</td>");
                    $("#weatherWell-" + wxTableRow + 1).append("<td>" + weatherLocaleTime.substr(0, weatherLocaleTime.indexOf(":")) + weatherLocaleTime.substr(weatherLocaleTime.length - 2, 2)) + "</td>";
                    $("#weatherWell-" + wxTableRow + 1).append("<td>" + dataLines[j].conditions + "</td>");
                    $("#weatherWell-" + wxTableRow + 1).append("<td>" + dataLines[j].temp.toFixed(0) + "</td>");
                    $("#weatherWell-" + wxTableRow + 1).append("<td>" + Math.round(dataLines[j].windspeed) + ' ' + windDirection + "</td>");

                    wxTableRow++;
                } else {
                    if (dataTimeTest == "AM" && lastDataTimeTest == "PM") {
                        saveJStart = j; //Save the starting place for the next day
                        j = dataLines.length;
                        timeTest = -1;
                        lastDataTimeTest = dataTimeTest;
                    }
                }

            };
            // set starting point to next dataLines entry
            saveJStart = saveJEnd;
        };


        /***************************************************************************** */
        //Tx and Tx Results Tabs

        /***************************************************************************** */
        // Get Tx data and fill txData Tab
        // API call for tx data for Filtering Tournaments
        var lakeTxData = {};
        var lakeTxResultsData = {};
        $.ajax({
                url: "/api/tournaments",
                method: "GET",
            })
            .then(function (data) {
                lakeTxData = data;
                lakeTxResultsData = data;
                let tableRow = 1;
                sortType = 0; // set sort to chronological order

                //Tx Tab

                // Flatten our data so it's easier to work with
                flattenData(lakeTxData, sortType, function () {
                    // sort by date when page loads (needs to be changed to be variable);
                    var newBatch = flatBatch.sort(sort_by('date', sortType, function (a) {
                        return a.toUpperCase()
                    }));
                    // display our newly flattened data for the first time (sorted by date);
                    let txBatch = newBatch;

                    txBatch.forEach(function (txOrg, i) {

                        if ((txOrg.lakeID == lakeRoute)) {
                            // Create the HTML Well (Section) and Add the table content for each reserved table
                            var txSection = $("<tr>");
                            txSection.addClass("well");
                            txSection.attr("id", "txWell-" + tableRow + 1);

                            // Set href as entryLink
                            txSection.attr("data-url", txOrg.entryLink); // Add data attribute to the row with entryLink url
                            txSection.addClass("clickable-row"); // Add clickable row css styles

                            $("#txSection").append(txSection);
                            // Append the data values to the table row
                            $("#txWell-" + tableRow + 1).append("<td>" + txOrg.organizer + "</td>");
                            $("#txWell-" + tableRow + 1).append("<td>" + txOrg.trail + "</td>");
                            $("#txWell-" + tableRow + 1).append("<td>" + txOrg.date + "</td>");
                            $("#txWell-" + tableRow + 1).append("<td>" + txOrg.ramp + "</td>");

                            tableRow++;
                        }
                    });

                });

                //TxResults Tab

                sortType = 1;

                // Flatten our data so it's easier to work with
                flattenData(lakeTxResultsData, sortType, function () {
                    // sort by date when page loads (needs to be changed to be variable);
                    var newBatch = flatBatch.sort(sort_by('date', sortType, function (a) {
                        return a.toUpperCase()
                    }));

                    // display our newly flattened data for the first time (sorted by date);
                    let txBatch = newBatch;

                    txBatch.forEach(function (txOrg, i) {

                        if ((txOrg.lakeID == lakeRoute)) {
                            // Create the HTML Well (Section) and Add the table content for each reserved table
                            var txResultsSection = $("<tr>");
                            txResultsSection.addClass("well");
                            txResultsSection.attr("id", "txResultsWell-" + tableRow + 1);

                            // Set href as resultsLink
                            txResultsSection.attr("data-url", txOrg.resultsLink); // Add data attribute to the row with resultsLink url
                            txResultsSection.addClass("clickable-row-results"); // ADd clickable results row css styles

                            $("#txResultsSection").append(txResultsSection);
                            // Append the data values to the table row
                            $("#txResultsWell-" + tableRow + 1).append("<td>" + txOrg.organizer + "</td>");
                            $("#txResultsWell-" + tableRow + 1).append("<td>" + txOrg.trail + "</td>");
                            $("#txResultsWell-" + tableRow + 1).append("<td>" + txOrg.date + "</td>");
                            $("#txResultsWell-" + tableRow + 1).append("<td>" + txOrg.ramp + "</td>");

                            tableRow++;
                        }
                    });

                });
            });


        /***************************************************************************** */
        // Charts tab
        /***************************************************************************** */

        // if there is an elevation level data source
        if (!noDataSource) {
            // build elevation chart
            buildElevChart(currentLake.data, currentLake);

            // build hourly elevation chart (river tide) chart
            // If elevation data is updated more than once a day
            if (currentLake.refreshInterval < 1450)
                buildRiverChart(currentLake.data, currentLake)

            // build flow chart if flows are available
            if (currentLake.data[0].flow !== "N/A") {
                buildFlowChart(currentLake.data);
            }
            // build hourly flow chart if flows are available
            if (currentLake.data[0].flow !== "N/A") {
                buildHourlyFlowChart(currentLake.data);
            }
        }
        // Add Weather charts
        // Add AirTemp
        buildTempChart(currentLake);

        // Add Barometric pressure
        buildBaroChart(currentLake);

        // Add Humidity
        buildHumidityChart(currentLake);

        // Add Windspeed
        buildWindChart(currentLake);

        // Add Windspeed
        buildWindDirectionChart(currentLake);


        // Hide loading gif
        hideLoader();

    })




/******************************************************************************************************************/
// jQuery tab click javascript code
// ===========================================

// hide all tabs
$(".tab-wrapper").hide();
// show only overview
$('#currentTab').show();

// listen for click on '.tab-btn' class
$(".tab-btn").click(function (event) { // remove active from any .tab-wrapper
    $(".tab-btn").removeClass("active");
    // hide all .tab-wrapper
    $(".tab-wrapper").hide();
    // add active to button that was clicked
    let clickedTab = event.target.id
    $(clickedTab).addClass("active");
    // show associated .tab-wrapper 
    let clickedWrapper = event.target.name;
    $("#" + clickedWrapper).show();
});


// // Capture table row clicks
$('tbody').on("click", "tr", function () {
    if ($(this).data("url")) {
        window.open(
            $(this).data("url"),
            '_blank' // <- This is what makes it open in a new window.
        );
    }
});