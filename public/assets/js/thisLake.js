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
    buildElevChart(data);
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
    let divisor = 0;
    let k = 0; // our iterator after starting elevation
    let chartMinElev = 100000; // y-axis Max elev value
    let chartMaxElev = 0; // y-axis Min elev value
    let chartMinElevLimit = 0; // y-axis Min elev Limit (for chart)
    let chartMaxElevLimit = 0; // y-axis Max elev Limit (for chart)
    let checkDate = data[0].date


    // Loop through our data for 24 data points if we have it
    for (k = 0; k < data.length; k++) {

        // if we're still on the same day and not on the last entry
        if (data[k].date === checkDate) {

            // add to our average variables
            sumOfElevs += data[k].elev;
            divisor++
        } else {

            // push data and reset averages
            if ((sumOfElevs / divisor) > chartMaxElev) // if value is greater than max, replace max
                chartMaxElev = sumOfElevs / divisor; // update Max Elev average
            if ((sumOfElevs / divisor) < chartMinElev) // if value is less thank min, replace min
                chartMinElev = sumOfElevs / divisor; // update Min Elev average
            labelBatch.push(checkDate);
            dataElevBatch.push((sumOfElevs / divisor).toFixed(2)); // calculate average
            dataNPBatch.push(lake.normalPool); // Normal Pool line batch 
            dataFCBatch.push(lake.topOfFloodControl); // Top of Flood Control Pool line batch
            //dataTDBatch.push(lake.topOfDam); // Top of Dam line batch

            sumOfElevs = data[k].elev;
            divisor = 1;
            checkDate = data[k].date
        }

        // when a week of data has been reached stop
        if (labelBatch.length > 13) {
            break;
        }
    }

    //push the final day's values after looping
    labelBatch.push(data[k - 1].date); // put final day date value in array
    dataElevBatch.push((sumOfElevs / divisor).toFixed(2)); // calculate average final day and push
    dataNPBatch.push(lake.normalPool); // Normal Pool line batch 
    dataFCBatch.push(lake.topOfFloodControl); // Normal Pool line batch 
    //dataTDBatch.push(lake.topOfDam); // Top of Dam line batch 

    //check the final day's values for Min and MaxLimit
    if ((sumOfElevs / divisor) > chartMaxElev) // if value is greater than max, replace max
        chartMaxElev = Math.ceil(sumOfElevs / divisor); // update Max Elev average
    if ((sumOfElevs / divisor) < chartMinElev) // if value is less thank min, replace min
        chartMinElev = Math.floor(sumOfElevs / divisor); // update Min Elev average

    if (lake.normalPool < chartMinElev)
        chartMinElev = lake.normalPool;

    if (lake.normalPool > chartMaxElev)
        chartMaxElev = lake.normalPool;

    labelBatch.reverse();
    dataElevBatch.reverse();

    // build elev chart
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
                    borderColor: 'rgb(0, 140, 255)',
                    data: dataElevBatch
                },
                {
                    type: 'line',
                    label: "Normal",
                    borderColor: 'rgb(100, 140, 100)',
                    data: dataNPBatch,
                    tension: 0 // disables bezier curves
                },
                {
                    type: 'line',
                    label: "Flood",
                    borderColor: 'rgb(172, 83, 83)',
                    data: dataFCBatch,
                    tension: 0 // disables bezier curves
                },
                /* {
                     label: "Top of Dam",
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
                        display: true,
                        labelString: 'Date',
                        fontSize: 14
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 14,
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
                        min: chartMinElev - .5, // Set chart bottom at 1ft less than min elev value
                        max: chartMaxElev + .5, // Set chart top at 1ft more than min elev value
                        maxTicksLimit: 12,
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
// Function to build daily flow chart on page
function buildFlowChart(data) {
    $("#flowChart").show();

    // Our data must be parsed into separate flat arrays for the chart
    let labelBatch = [];
    let dataFlowBatch = [];
    let sumOfFlows = 0;
    let divisor = 0;
    let k = 0; // our iterator after starting flow
    let chartMinFlow = 2000; // y-axis Max Flow value
    let chartMaxFlow = 0; // y-axis Min Flow value
    let chartMinFlowLimit = 0; // y-axis Min Flow value
    let chartMaxFlowLimit = 0; // y-axis Max Flow value
    let avgFlow = 0;
    let checkDate = data[0].date;

    // Loop through our data for 24 data points if we have it
    for (k = 0; k < data.length; k++) {


        if (data[k].flow == "Missing" || data[k].flow < 0) {
            console.log("Missing")
        } else {
            sumOfFlows += data[k].flow
            divisor++

        }

        if (data[k].date !== checkDate) {
            avgFlow = Number((sumOfFlows / divisor).toFixed(2))
            labelBatch.push(data[k - 1].date);
            dataFlowBatch.push(avgFlow);
            sumOfFlows = 0;
            divisor = 0;
            checkDate = data[k].date;
            if (avgFlow >= chartMaxFlow) // if value is greater than max, replace max
                chartMaxFlow = avgFlow; // flow for calculating Chart y-axis Max later

        }

        // when a week of data has been reached stop
        if (labelBatch.length > 14) {
            break;
        }

    }

    //check the final day's values for Min and MaxLimit
    //if ((sumOfFlows / divisor) <= chartMinFlow)
    //chartMinFlow = (sumOfFlows / divisor);
    if ((sumOfFlows / divisor) >= chartMaxFlow)
        chartMaxFlow = Number((sumOfFlows / divisor).toFixed(2));;

    labelBatch.reverse();
    dataFlowBatch.reverse();

    // Set y axis limits for Flow Chart
    chartMinFlowLimit = 0; // set lower chart limit
    chartMaxFlowLimit = Math.round(((((chartMaxFlow - (chartMaxFlow % 1000)) / 1000) * 1.25) * 1000) / 1000) * 1000; // set the chart upper limit

    //if (chartMinFlowLimit < 1000) chartMinFlowLimit = 0; // Flow Min limit should just be set to 0

    if (chartMaxFlowLimit < 4000)
        chartMaxFlowLimit = (Math.ceil(chartMaxFlow / 1000) * 1000) + 1000;


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
                        fontSize: 14
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 14,
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
    let hourlyElev = 0;


    // Loop through our data for 48 data points if we have it
    // two days worth of data may show the tides in tidal rivers 
    for (k = 1; k < data.length; k++) {

        // Set hourlyElev
        if (k < 2)
            hourlyElev = Number((data[k - 1].elev + data[k].elev) / 2);
        else
            hourlyElev = Number((data[k - 2].elev + data[k - 1].elev + data[k].elev) / 3);

        labelBatch.push(data[k - 1].time.substr(0, data[k - 1].time.length - 3));
        dataRiverBatch.push(hourlyElev.toFixed(2)); // push elev

        if (hourlyElev.toFixed(2) > chartMaxRiver) // if value is greater than max, replace max
            chartMaxRiver = hourlyElev.toFixed(2); // update Max Elev average
        if (hourlyElev.toFixed(2) < chartMinRiver) // if value is less thank min, replace min
            chartMinRiver = hourlyElev.toFixed(2); // update Min Elev average


        // when a week of data has been reached stop
        if (labelBatch.length > 47) {
            break;
        }
    }

    labelBatch.reverse();
    dataRiverBatch.reverse();

    // Set axis limits for River Chart
    let minMaxDiff = Number((chartMaxRiver - chartMinRiver).toFixed(2));
    let chartGap = Number((minMaxDiff));

    if (minMaxDiff > 20)
        chartGap = Number((minMaxDiff * .1).toFixed(0));
    if (chartGap < 1)
        chartGap = .05;

    chartMaxRiverLimit = Math.ceil((Number(chartMaxRiver) + chartGap) * 10) / 10; // set the chart upper limit

    chartMinRiverLimit = Math.floor((Number(chartMinRiver) - chartGap) * 10) / 10; // set the chart lower limit


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
                        display: true,
                        labelString: 'Time (of Day)',
                        fontSize: 14
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 16,
                        fontSize: 12
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
                        stepSize: (minMaxDiff).toFixed(1),
                        //autoSkip: true,
                        maxTicksLimit: 6,
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

    // Loop through our data for 24 data points if we have it
    for (k = 0; k < data.length; k++) {

        // if we're past the first entry
        //if (k > 0) {
        labelBatch.push(data[k].time.substr(0, data[k].time.length - 3)); // Remove minutes
        if (data[k].flow !== "Missing" && data[k].flow !== "N/A" && data.refreshInterval !== 180) {
            dataFlowBatch.push((data[k].flow).toFixed(2)); // push elev

            if (data[k].flow > chartMaxFlow) // if value is greater than max, replace max
                chartMaxFlow = data[k].flow; // update Max Elev average
            if (data[k].flow < chartMinFlow) // if value is less thank min, replace min
                chartMinFlow = data[k].flow; // update Min Elev average

        } else dataFlowBatch.push(-99); // push elev
        //}

        // when a week of data has been reached stop
        if (labelBatch.length > 47) {
            break;
        }
    }

    labelBatch.reverse();
    dataFlowBatch.reverse();

    // Set y axis limits for hourly Flow Chart
    let chartGap = chartMaxFlow / 5;
    chartGap = Math.ceil((chartGap / 1000).toFixed(0)) * 1000;
    //let minMaxDiff = chartMaxFlow - chartMinFlow;
    //if (minMaxDiff < 1 && minMaxDiff !== 0) chartGap = minMaxDiff * 2;
    chartMinFlowLimit = 0; // set the chart lower limit
    chartMaxFlowLimit = ((Math.ceil(chartMaxFlow / 1000) * 1000) + Math.round(chartGap)); // set the chart upper limit

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
                        labelString: 'Time (of Day)',
                        fontSize: 14
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 16,
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
                        maxTicksLimit: 12,
                        min: chartMinFlowLimit, // Set chart bottom at 1ft less than min elev value
                        max: chartMaxFlowLimit, // Set chart top at 1ft more than min elev value
                        stepSize: chartGap, // Set the y-axis step value to  ft.
                        //autoSkip: true,
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
    let dewpointBatch = [];
    let feelsLikeBatch = [];
    let k = 0; // our iterator after starting Temp
    let chartMinTemp = 100000; // y-axis Max temp value
    let chartMaxTemp = 0; // y-axis Min temp value
    let chartMinTempLimit = 0; // y-axis Min temp Limit (for chart)
    let chartMaxTempLimit = 0; // y-axis Max temp Limit (for chart)

    // Loop through our data for 24 data points if we have it
    for (k; k < tempData.ccWxData.length; k++) {
        if (typeof tempData.ccWxData[k].temp == "number") {

            //calculate the time as 12 hour AM PM.
            let timeStamp = new Date(tempData.ccWxData[k].date);

            //calculate the time as 12 hour AM PM.
            hour = timeStamp.getHours();
            let suffix = "PM";
            if (hour < 12)
                suffix = "AM";
            hour = ((hour + 11) % 12 + 1);

            // Calculate Dewpoint (Tdp = Tf - 9/25(100-RH))
            let dewPoint = tempData.ccWxData[k].temp - (.36 * (100 - tempData.ccWxData[k].humidity));

            feelsLikeBatch.push(tempData.ccWxData[k].feelslike);
            dewpointBatch.push(dewPoint); // push dew point
            //labelBatch.push(hour + suffix); // push time
            labelBatch.push(hour); // push time
            dataTempBatch.push(tempData.ccWxData[k].temp); // push Temp

            if (tempData.ccWxData[k].temp > chartMaxTemp) // if temp value is greater than max, replace max
                chartMaxTemp = tempData.ccWxData[k].temp; // update Max Temp average

            if (tempData.ccWxData[k].feelslike > chartMaxTemp) // if feelslike value is greater than max, replace max
                chartMaxTemp = tempData.ccWxData[k].feelslike; // update Max Temp average

            if (tempData.ccWxData[k].temp < chartMinTemp) // if temp value is less than min, replace min
                chartMinTemp = tempData.ccWxData[k].temp; // update Min Temp average

            if (tempData.ccWxData[k].feelslike < chartMinTemp) // if feelslike value is less than min, replace min
                chartMinTemp = tempData.ccWxData[k].feelslike; // update Min Temp average

            //if (dewPoint < chartMinTemp) // if value is less thank min, replace min
            //chartMinTemp = dewPoint; // update Min Temp average

        }

        // when two days of data has been reached stop
        if (labelBatch.length > 23 || k > tempData.ccWxData.length - 1) {
            break;
        }
    }

    // Set y axis limits for Temp Chart
    let minMaxDiff = chartMaxTemp - chartMinTemp;
    if (minMaxDiff < 1) chartGap = minMaxDiff / 2;
    chartMinTempLimit = Math.floor(chartMinTemp) - 1; // set the chart lower limit 2' below min
    chartMaxTempLimit = Math.ceil(chartMaxTemp) + 1; // set the chart upper limit 2' below max

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
                    borderColor: 'rgb(0, 140, 255)',
                    data: dataTempBatch
                },
                /*{
                               type: 'line',
                               label: "Dew Pt",
                               borderColor: 'rgb(100, 140, 100)',
                               data: dewpointBatch
                           },*/
                {
                    type: 'line',
                    label: "Feels Like",
                    borderColor: 'rgb(172, 83, 83)',
                    data: feelsLikeBatch
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
                        display: true,
                        labelString: 'Time (of Day)',
                        fontSize: 14
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
                        stepSize: Math.ceil((chartMaxTemp - chartMinTemp) / 2) - 5, // Set the y-axis step value to  ft.
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

            //labelBatch.push(hour + suffix)
            labelBatch.push(hour); // push time
            dataHumidityBatch.push(humidityData.ccWxData[k].humidity); // push elev

            if (chartMaxHumidity < humidityData.ccWxData[k].humidity)
                chartMaxHumidity = humidityData.ccWxData[k].humidity

            if (chartMinHumidity > humidityData.ccWxData[k].humidity)
                chartMinHumidity = humidityData.ccWxData[k].humidity

        }

        // when 2 days of data has been reached stop
        if (labelBatch.length > 23 || k > humidityData.ccWxData.length - 1) {
            break;
        }
    }

    // Set axis limits for Humidity Chart
    chartMinHumidityLimit = chartMinHumidity - 10; // set the chart lower limit
    chartMaxHumidityLimit = chartMaxHumidity + 10; // set the chart upper limit

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
                        display: true,
                        labelString: 'Time (of Day)',
                        fontSize: 14
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

            // Convert millibars to inches
            baroData.ccWxData[k].baro = baroData.ccWxData[k].baro * 0.0295301

            labelBatch.push(hour); // push time
            //labelBatch.push(hour + suffix);
            dataBaroBatch.push(baroData.ccWxData[k].baro); // push elev

            if (baroData.ccWxData[k].baro > chartMaxBaro) // if value is greater than max, replace max
                chartMaxBaro = baroData.ccWxData[k].baro; // update Max Elev average
            if (baroData.ccWxData[k].baro < chartMinBaro) // if value is less thank min, replace min
                chartMinBaro = baroData.ccWxData[k].baro; // update Min Elev average

        }

        // when 2 days of data has been reached stop
        if (labelBatch.length > 47 || k > baroData.ccWxData.length - 1) {
            break;
        }
    }

    // Set y axis limits for Baro Chart
    //let minMaxDiff = chartMaxBaro - chartMinBaro;
    //if (minMaxDiff < 1) chartGap = minMaxDiff / 2;
    chartMinBaroLimit = Math.floor(chartMinBaro * 10) / 10 - 0.1; // set the chart lower limit
    chartMaxBaroLimit = Math.ceil(chartMaxBaro * 10) / 10 + 0.1; // set the chart upper limit

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
                label: "Pressure (inches)",
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
                        display: true,
                        labelString: 'Time (of Day)',
                        fontSize: 14
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
                        labelString: 'Pressure inches',
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

            labelBatch.push(hour); // push time
            //labelBatch.push(hour + suffix);
            dataWindBatch.push(windData.ccWxData[k].windspeed); // push wind speeed

            if (windData.ccWxData[k].windspeed > chartMaxWind) // if value is greater than max, replace max
                chartMaxWind = windData.ccWxData[k].windspeed; // update Max Wind
            if (windData.ccWxData[k].windspeed < chartMinWind) // if value is less thank min, replace min
                chartMinWind = windData.ccWxData[k].windspeed; // update Min Wind

        };

        // when 2 days of data has been reached stop
        if (labelBatch.length > 23 || k > windData.ccWxData.length - 2) {
            break;
        };
    };

    // Set y axis limits for Baro Chart
    let chartGap = chartMaxWind * .2;
    let minMaxDiff = chartMaxWind - chartMinWind;
    if (minMaxDiff < 1) chartGap = minMaxDiff / 2;
    chartMinWindLimit = 0; // set the chart lower limit
    chartMaxWindLimit = Math.round(chartMaxWind) + Math.round(chartGap); // set the chart upper limit

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
                        display: true,
                        labelString: 'Time (of Day)',
                        fontSize: 14
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

            labelBatch.push(hour); // push time
            //labelBatch.push(hour + suffix);

            // check to see if wind direction reported is null
            if (windData.ccWxData[k].winddirection == null) {
                windDirection = 0;

            } else {
                windDirectionIndex = compassSector.indexOf(windData.ccWxData[k].winddirection);
            };
            dataWindBatch.push(windDirectionIndex); // push wind direction

        };

        // when 2 days of data has been reached stop
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
                        display: true,
                        labelString: 'Time (of Day)',
                        fontSize: 14
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


/******************************************************************************************************************/
// Function to build Guide list on page
function buildGuideList(sponsorData) {
    $("#lakeGuides").show();
    // call the backend and return sponsor data array
    $.ajax({
            url: "/api/sponsors",
            method: "GET",
        })
        .then(function (data) {

            let today = new Date();
            sponsors = data;
            // // Clear any guide content in the scroller
            $("#guideSection").empty();

            sponsors.forEach(function (element) {
                if (element.type == 'guide') {
                    if ((element.guideLakes.includes(lakeRoute) &&
                            (new Date(element.startDate) <= today &&
                                new Date(element.endDate) >= today))) {
                        var a = $("<a target='_blank'>");
                        a.attr("href", element.href);
                        var adImg = $("<img style= 'width: 90%; margin-right: 10px; margin-left: 10px;' class='guide-logo'>");
                        //var adImg = $("<img class='ad-guide'>")
                        adImg.attr("src", element.src);
                        $("#guideLogoWell").append(a);
                        $(a).append(adImg);
                        $(a).append("<br>");
                        $(a).append("<br>");

                    }
                }
            })
        })


} // end of buildGuideList



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
/******************************************************************************************************************/
/******************************************************************************************************************/
/******************************************************************************************************************/
//
//
//      Process the PAGE
//
//
/******************************************************************************************************************/
/******************************************************************************************************************/
/******************************************************************************************************************/
/******************************************************************************************************************/

// Get current lake from database

// Declare variable to hold currentLake object
var currentLake = {};
var rampData = {};
var noDataSource = false;
var sensorDown = true;
// Set lake title on page
if (currentLake.bodyOfWater.includes("(")) {
    $("#lakeTitle").append(currentLake.bodyOfWater.substr(0, currentLake.bodyOfWater.indexOf("(")));
    $("#lakeSubTitle").append(currentLake.bodyOfWater.substr(currentLake.bodyOfWater.indexOf("("), currentLake.bodyOfWater.length));
} else {

    $("#lakeTitle").append(currentLake.bodyOfWater);
    $("#lakeSubTitle").append(" ");
}
$.ajax({
        url: "/api/find-one-lake",
        method: "GET",
        data: {
            lakeName: lakeRoute
        }
    })
    .then(function (data) {
        sensorDown = false;
        currentLake = data;
        if (currentLake.data.length == 0)
            noDataSource = true

        /***************************************************************************** */
        //Current Tab (H2O)
        /***************************************************************************** */

        // Set lake title on page
        if (currentLake.bodyOfWater.includes("(")) {
            $("#lakeTitle").append(currentLake.bodyOfWater.substr(0, currentLake.bodyOfWater.indexOf("(")));
            $("#lakeSubTitle").append(currentLake.bodyOfWater.substr(currentLake.bodyOfWater.indexOf("("), currentLake.bodyOfWater.length));
        } else {

            $("#lakeTitle").append(currentLake.bodyOfWater);
            $("#lakeSubTitle").append(" ");
        }
        // Date change marker in case I need to remove it, 1334-5-6 and 1338 to -
        // new Date(currentLake.data[0].time).toString().substr(0, 21)
        // Set current date, time elev, and pool on page
        if (!noDataSource) {
            let x = 0;
            if (!noDataSource) {

                // For Duke Energy Lakes, show the actual gage reading.
                if (currentLake.dataSource[0] == "DUKE") {
                    // Duke does not update until after midnight GMT so if current day level is 0
                    // show previous day level
                    if (currentLake.data[x].elev == null)
                        x = 1;
                    let gage = (currentLake.data[x].elev - currentLake.seaLevelDelta).toFixed(2);
                    $("#gageReading").append("Gage (" + gage + " ft.)");
                }
                let dateTime = new Date(currentLake.data[x].time);
                let currentTabDateStamp = dateTime.toLocaleDateString();
                let currentTabTimeStamp = dateTime.toLocaleTimeString().replace(":00:00 ", "");
                $("#currentLevel").append(currentLake.data[x].elev);
                $("#currentDate").append(currentLake.data[x].date);
                $("#currentTime").append(currentTabDateStamp + " " + currentTabTimeStamp);
                $("#currentDelta").append((currentLake.data[x].elev - currentLake.normalPool).toFixed(2));
                $("#currentNormal").append("Normal Pool " + currentLake.normalPool + " (MSL)");
            } else {
                if (sensorDown)
                    $("#currentLevel").append("Water level sensor down");
                else
                    $("#currentLevel").append("No known source for level data");
            };
        }

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
        $("#currentWeatherTemp").append(currentLake.ccWxData[ccIndex].temp.toFixed(0));
        $("#currentWeatherHumidity").append(currentLake.ccWxData[ccIndex].humidity);
        $("#currentWeatherBarometric").append((currentLake.ccWxData[ccIndex].baro * 0.0295301).toFixed(2)); // Convert from mb to inches
        $("#currentWeatherWindSpeed").append(currentLake.ccWxData[ccIndex].windspeed);
        $("#currentWeatherWindDirection").append(currentLake.ccWxData[ccIndex].winddirection);
        $("#currentWeatherDate").append(ccDate + " " + hour + suffix);
        $("#currentWeatherTime").append(currentLake.ccWxData[ccIndex].location);

        /***************************************************************************** */
        //Ramp Tab
        /***************************************************************************** */

        // API call for ramp data for Ramps (function found in apiRoutes.js)
        //
        // Optimized 9/09/20 JRY
        // If a lakeName is specified, the ajax call will return only the ramps for that lake.
        // If lakeName is not specified, the ajax call will return all ramps for all lakes. 
        // This moves some processing to the server side.

        $.ajax({
                url: "/api/ramps",
                method: "GET",
                data: {
                    lakeName: lakeRoute
                }
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
                entry.date = entry.date.substr(0, entry.date.length - 5, );
                entry.time = entry.time.substr(0, entry.time.indexOf(":")) + ' ' + entry.time.substr(entry.time.length - 2, 2);
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
        let dayLines = [];
        let dataLines = [];
        let dayTest = '';
        let lastDayTest = '';
        let localeTime = new Date;

        fxData.forEach(function (element, i) {
            if ((element !== "undefined")) {
                localeTime = new Date(element.time.replace(' ', 'T') + "Z");
                dayTest = localeTime.toLocaleTimeString().substr(localeTime.toLocaleTimeString().length - 2, 2);

                // if the first element for a Day forecast element 
                if ((dayTest == 'AM' && lastDayTest == 'PM') || i == 0) {

                    // This is a "Day" Line in the data,  push it into the well
                    dayLines.push({
                        conditions: element.conditions,
                        high: element.temp,
                        humidity: element.humidity,
                        low: element.temp,
                        temp: element.temp,
                        date: localeTime.toLocaleDateString(),
                        time: localeTime.toLocaleTimeString().replace(":00:00 ", ""),
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
                            date: localeTime.toLocaleDateString(),
                            time: localeTime.toLocaleTimeString().replace(":00:00 ", ""),
                            winddirection: element.winddirection,
                            windspeed: element.windspeed
                        });
                    };
                };
                lastDayTest = dayTest;
            };
        });

        // Set the Day High and Low temp to the correct value (calculate)
        // We must do this because the high and low temp are set according 
        // to UTC time, which skews the temps and the days.
        for (i = 0; i < dayLines.length - 1; i++) {

            // go through the datalines and save the high and low temp for the Day
            for (j = saveJStart; j < dataLines.length - 1; j++) {

                // check current dataLine time against previous dataLine time for midnight rollover
                // cannot check date due to change from UTC to local time
                // have to check for when the time rolls over midnight
                if ((dayLines[i].date == dataLines[j].date)) {
                    // not a new day, save high and low temp
                    if (dataLines[j].temp > dayLines[i].high)
                        dayLines[i].high = dataLines[j].temp;
                    if (dataLines[j].temp < dayLines[i].low)
                        dayLines[i].low = dataLines[j].temp;

                } else {
                    //is a new day
                    saveJEnd = j;
                    j = dataLines.length;
                };
            };

            //********************************************************************** */
            // now stuff the Day and Data Lines in the correct order into the well
            //********************************************************************** */

            // Create the HTML Well (Section) and Add the table content for each reserved table

            // Append the Days remaining forecast to the well
            var weatherSection = $("<tr>");
            weatherSection.addClass("well");
            weatherSection.attr("id", "weatherWell-" + wxTableRow + 1);
            $("#weatherSection").append(weatherSection);

            let yearIndex = dayLines[i].date.lastIndexOf('/'); // find the '/' in front of the year.
            // Append the day lines
            $("#weatherWell-" + wxTableRow + 1).append("<td>" + dayLines[i].date.substring(0, yearIndex) + "</td>");
            $("#weatherWell-" + wxTableRow + 1).append("<td>" + dayLines[i].time + "</td>");
            $("#weatherWell-" + wxTableRow + 1).append("<td> " + dayLines[i].conditions + "</td>");
            $("#weatherWell-" + wxTableRow + 1).append("<td>" + dayLines[i].high.toFixed(0) + '/' + dayLines[i].low.toFixed(0) + "</td>");
            $("#weatherWell-" + wxTableRow + 1).append("<td>" + Math.round(dayLines[i].windspeed) + ' ' + dayLines[i].winddirection + "</td>");

            wxTableRow++;

            for (j = saveJStart; j < saveJEnd + 1; j++) {

                if (dayLines[i].date == dataLines[j].date) {
                    var weatherSection = $("<tr>");
                    weatherSection.addClass("well");
                    weatherSection.attr("id", "weatherWell-" + wxTableRow + 1);
                    $("#weatherSection").append(weatherSection);

                    let windDirection = dataLines[j].winddirection;
                    if (windDirection == null)
                        windDirection = "N/A";

                    $("#weatherWell-" + wxTableRow + 1).append("<td>" + " " + "</td>");
                    //$("#weatherWell-" + wxTableRow + 1).append("<td>" + weatherLocaleTime.substr(0, weatherLocaleTime.indexOf(":")) + weatherLocaleTime.substr(weatherLocaleTime.length - 2, 2)) + "</td>";
                    $("#weatherWell-" + wxTableRow + 1).append("<td>" + dataLines[j].time + "</td>");
                    $("#weatherWell-" + wxTableRow + 1).append("<td>" + dataLines[j].conditions + "</td>");
                    $("#weatherWell-" + wxTableRow + 1).append("<td>" + dataLines[j].temp.toFixed(0) + "</td>");
                    $("#weatherWell-" + wxTableRow + 1).append("<td>" + Math.round(dataLines[j].windspeed) + ' ' + windDirection + "</td>");

                    wxTableRow++;
                } else {
                    saveJStart = j; //Save the starting place for the next day
                    j = dataLines.length;
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
                data: {
                    lakeName: lakeRoute
                }
            })
            .then(function (data) {
                lakeTxData = data;
                lakeTxResultsData = data;
                let tableRow = 1;
                sortType = 0; // set sort to chronological order

                /***************************************************************************** */
                //Tx Tab
                /***************************************************************************** */

                // Data was flattened by the ajax call to the server
                // Simply need to display the data

               
                // display our newly flattened data for the first time (sorted by date);
                lakeTxData.forEach(function (txOrg, i) {

                    if ((txOrg.type == 0)) {

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
                    } else

                        /***************************************************************************** */
                        //TxResults Tab
                        /***************************************************************************** */

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


        /***************************************************************************** */
        // Charts tab
        /***************************************************************************** */

        // if there is an elevation level data source
        if (!noDataSource) {

            // build elevation chart
            buildElevChart(currentLake.data, currentLake);

            // If elevation data is updated more than once a day
            // build hourly elevation chart (river tide) chart
            if (currentLake.refreshInterval < 180) {
                buildRiverChart(currentLake.data, currentLake);
                // build hourly flow chart if flows are available
                if (currentLake.data[0].flow !== "N/A")
                    buildHourlyFlowChart(currentLake.data);
            }

            // build flow chart if flows are available
            if (currentLake.data[0].flow !== "N/A")
                buildFlowChart(currentLake.data);

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

        // Add Windspeed
        buildGuideList(currentLake);

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


// Capture table row clicks
$('tbody').on("click", "tr", function () {
    if ($(this).data("url")) {
        window.open(
            $(this).data("url"),
            '_blank' // <- This is what makes it open in a new window.
        );
    }
});