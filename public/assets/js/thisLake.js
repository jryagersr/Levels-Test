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



function buildElevChart(data, lake) {
    $("#elevChart").show();

    let chartElevObject = {
        type: "Elev",
        dataNPBatch: [],
        dataFCBatch: [],
        labelBatch: [],
        dataElevBatch: [],
        chartMinElevLimit: 0,
        chartMaxElevLimit: 0
    }

    // process elevation data into the data arrays required for the charts
    // let chartData = buildElevData(currentLake.data, currentLake);

    // buildElevData returns a data array consisting of 
    //      Normal Pool   data array (straight line)
    //      Flood Control data array (straight line)
    //      Hourly        data array (x-axis labels)
    //      Elevation     data array (graph line and y-axis labels)
    //      Min Elev      value      (chart minimum tick)
    //      Max Elev      value      (chart maximum tick)
    //
    // Find index in chartData for Elev data
    let elevIndex = 0;


    for (i = 0; i < lake.chartData.length; i++) {

        if (lake.chartData[i].type == "Elev") {
            elevExists = true;
            elevIndex = i;
            break;
        }
    };

    chartElevObject = data[elevIndex];

    for (i = 0; i < chartElevObject.labelBatch.length; i++) {
        let thisDate = new Date(chartElevObject.labelBatch[i]);
        thisDate = thisDate.toLocaleDateString();
        chartElevObject.labelBatch[i] = thisDate.substr(0, thisDate.length - 5, );
    }

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
            labels: chartElevObject.labelBatch,
            datasets: [{
                    type: 'line',
                    label: "Level",
                    borderColor: 'rgb(0, 140, 255)',
                    data: chartElevObject.dataElevBatch
                },
                {
                    type: 'line',
                    label: "Normal",
                    borderColor: 'rgb(100, 140, 100)',
                    data: chartElevObject.dataNPBatch,
                    tension: 0 // disables bezier curves
                },
                {
                    type: 'line',
                    label: "Flood",
                    borderColor: 'rgb(172, 83, 83)',
                    data: chartElevObject.dataFCBatch,
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
                        min: chartElevObject.chartMinElevLimit - .5, // Set chart bottom at 1ft less than min elev value
                        max: chartElevObject.chartMaxElevLimit + .5, // Set chart top at 1ft more than min elev value
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

    let chartFlowObject = {
        type: "Flow",
        labelBatch: [],
        dataFlowBatch: [],
        chartMinFlowLimit: 0, // y-axis Min Flow value
        chartMaxFlowLimit: 0 // y-axis Max Flow value
    }

    let flowIndex = 0;
    for (i = 0; i < data.length; i++) {

        if (data[i].type == "Flow") {
            flowExists = true;
            flowIndex = i;
            break;
        }
    };


    chartFlowObject = data[flowIndex];

    var ctx = document.getElementById('myFlowChart').getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop(0, 'rgb(0,140,255)');
    grd.addColorStop(1, 'rgb(0,55,255)');
    var chart = new Chart(ctx, {

        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: chartFlowObject.labelBatch,
            datasets: [{
                label: "Flow",
                borderColor: 'rgb(0, 140, 255)',
                data: chartFlowObject.dataFlowBatch
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
                        min: chartFlowObject.chartMinFlowLimit, // Set chart bottom at calculated value
                        max: chartFlowObject.chartMaxFlowLimit, // Set chart top at calculated value
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

    let chartRiverObject = {
        type: "River",
        labelBatch: [],
        dataRiverBatch: [],
        chartMinRiverLimit: 0, // y-axis Min Flow value
        chartMaxRiverLimit: 0, // y-axis Max Flow value
        minMaxDiff: 0
    }

    let riverIndex = 0;
    for (i = 0; i < data.length; i++) {

        if (data[i].type == "River") {
            riverExists = true;
            riverIndex = i;
            break;
        }
    };


    chartRiverObject = data[riverIndex];

    for (i = 0; i < chartRiverObject.labelBatch.length; i++) {
        let time = new Date(chartRiverObject.labelBatch[i]);
        time = time.toLocaleTimeString();
        time = time.split(":");
        hour = time[0];
        chartRiverObject.labelBatch[i] = hour;
    }

    var ctx = document.getElementById('myRiverChart').getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop(0, 'rgb(0,140,255)');
    grd.addColorStop(1, 'rgb(0,55,255)');
    var chart = new Chart(ctx, {

        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: chartRiverObject.labelBatch,
            datasets: [{
                type: 'line',
                label: "Level",
                borderColor: 'rgb(0, 140, 255)',
                data: chartRiverObject.dataRiverBatch
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
                        min: chartRiverObject.chartMinRiverLimit, // Set chart bottom at 1ft less than min elev value
                        max: chartRiverObject.chartMaxRiverLimit, // Set chart top at 1ft more than min elev value
                        stepSize: (chartRiverObject.minMaxDiff).toFixed(1),
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

    let chartFlowHourlyObject = {
        type: "FlowHourly",
        labelBatch: [],
        dataFlowHourlyBatch: [],
        chartMinFlowHourlyLimit: 0, // y-axis Min Flow value
        chartMaxFlowHourlyLimit: 0, // y-axis Max Flow value
        chartGap: 0
    }



    let flowHourlyIndex = 0;
    for (i = 0; i < data.length; i++) {

        if (data[i].type == "FlowHourly") {
            flowHourlyExists = true;
            flowHourlyIndex = i;
            break;
        }
    };


    chartFlowHourlyObject = data[flowHourlyIndex];


    for (i = 0; i < chartFlowHourlyObject.labelBatch.length; i++) {
        let time = new Date(chartFlowHourlyObject.labelBatch[i]);
        time = time.toLocaleTimeString();
        time = time.split(":");
        hour = time[0];
        chartFlowHourlyObject.labelBatch[i] = hour;
    }

    var ctx = document.getElementById('myHourlyFlowChart').getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop(0, 'rgb(0,140,255)');
    grd.addColorStop(1, 'rgb(0,55,255)');
    var chart = new Chart(ctx, {

        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: chartFlowHourlyObject.labelBatch,
            datasets: [{
                type: 'line',
                label: "Flow (cfs)",
                borderColor: 'rgb(0, 140, 255)',
                data: chartFlowHourlyObject.dataFlowHourlyBatch
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
                        min: chartFlowHourlyObject.chartMinFlowLimit, // Set chart bottom at 1ft less than min elev value
                        max: chartFlowHourlyObject.chartMaxFlowLimit, // Set chart top at 1ft more than min elev value
                        stepSize: chartFlowHourlyObject.chartGap, // Set the y-axis step value to  ft.
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

    let chartTempObject = {
        type: "Temp",
        labelBatch: [],
        dataTempBatch: [],
        dewPointBatch: [],
        feelsLikeBatch: [],
        chartMinTempLimit: 0, // y-axis Min Flow value
        chartMaxTempLimit: 0, // y-axis Max Flow value
        minMaxDiff: 0
    }

    let tempIndex = 0;
    for (i = 0; i < tempData.length; i++) {

        if (tempData[i].type == "Temp") {
            tempExists = true;
            tempIndex = i;
            break;
        }
    };

    chartTempObject = tempData[tempIndex];
    
    for (i = 0; i < chartTempObject.labelBatch.length; i++) {
       let thisTime = new Date(chartTempObject.labelBatch[i]);
       thisTime = thisTime.toLocaleTimeString();
       thisTime = thisTime.split(":");
       hour = thisTime[0];
       chartTempObject.labelBatch[i] = hour;
   }

     //calculate the time as 12 hour AM PM.
     //hour = timeStamp.getHours();
     //let suffix = "PM";
     //if (hour < 12)
     //  suffix = "AM";
     //hour = ((hour + 11) % 12 + 1);

    var ctx = document.getElementById('myTempChart').getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop(0, 'rgb(0,140,255)');
    grd.addColorStop(1, 'rgb(0,55,255)');
    var chart = new Chart(ctx, {

        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: chartTempObject.labelBatch,
            datasets: [{
                    type: 'line',
                    label: "Temp (F)",
                    borderColor: 'rgb(0, 140, 255)',
                    data: chartTempObject.dataTempBatch
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
                    data: chartTempObject.feelsLikeBatch
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
                        min: chartTempObject.chartMinTempLimit, // Set chart bottom at 1ft less than min elev value
                        max: chartTempObject.chartMaxTempLimit, // Set chart top at 1ft more than min elev value
                        stepSize: Math.ceil((chartTempObject.minMaxDiff) / 2) - 5, // Set the y-axis step value to  ft.
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
function buildHumidityChart(humidityData, lake) {
    $("#humidityChart").show();



    let chartHumidityObject = {
        type: "Humidity",
        labelBatch: [],
        dataHumidityBatch: [],
        chartMinHumidityLimit: 101, // y-axis Min Flow value
        chartMaxHumidityLimit: 0, // y-axis Max Flow value
        minMaxDiff: 0
    }

    let humidityIndex = 0;
    for (i = 0; i < humidityData.length; i++) {

        if (humidityData[i].type == "Humidity") {
            humidityExists = true;
            humidityIndex = i;
            break;
        }
    };
    chartHumidityObject = humidityData[humidityIndex];

    var ctx = document.getElementById('myHumidityChart').getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop(0, 'rgb(0,140,255)');
    grd.addColorStop(1, 'rgb(0,55,255)');
    var chart = new Chart(ctx, {

        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: chartHumidityObject.labelBatch,
            datasets: [{
                type: 'line',
                label: "Humidity %",
                borderColor: 'rgb(0, 140, 255)',
                data: chartHumidityObject.dataHumidityBatch
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
                        min: chartHumidityObject.chartMinHumidityLimit, // Set chart bottom at 1ft less than min elev value
                        max: chartHumidityObject.chartMaxHumidityLimit, // Set chart top at 1ft more than min elev value
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


    let chartBaroObject = {
        type: "Baro",
        labelBatch: [],
        dataBaroBatch: [],
        chartMinBaroLimit: 35, // y-axis Min Flow value
        chartMaxBaroLimit: 0, // y-axis Max Flow value
        chartGap: 0
    }

    let baroIndex = 0;
    for (i = 0; i < baroData.length; i++) {

        if (baroData[i].type == "Baro") {
            baroExists = true;
            baroIndex = i;
            break;
        }
    };

    chartBaroObject = baroData[baroIndex];
    
    for (i = 0; i < chartBaroObject.labelBatch.length; i++) {
        let thisTime = new Date(chartBaroObject.labelBatch[i]);
        thisTime = thisTime.toLocaleTimeString();
        thisTime = thisTime.split(":");
        hour = thisTime[0];
        chartBaroObject.labelBatch[i] = hour;
    }

    var ctx = document.getElementById('myBaroChart').getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop(0, 'rgb(0,140,255)');
    grd.addColorStop(1, 'rgb(0,55,255)');
    var chart = new Chart(ctx, {

        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: chartBaroObject.labelBatch,
            datasets: [{
                type: 'line',
                label: "Pressure (inches)",
                borderColor: 'rgb(0, 140, 255)',
                data: chartBaroObject.dataBaroBatch
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
                        min: chartBaroObject.chartMinBaroLimit, // Set chart bottom at 1ft less than min elev value
                        max: chartBaroObject.chartMaxBaroLimit, // Set chart top at 1ft more than min elev value
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
// Function to build Wind Speed chart page
function buildWindChart(windData) {
    $("#windChart").show();


    let chartWindObject = {
        type: "Wind",
        labelBatch: [],
        dataWindBatch: [],
        chartMinWindLimit: 35, // y-axis Min Flow value
        chartMaxWindLimit: 0, // y-axis Max Flow value
    }

    let windIndex = 0;
    for (i = 0; i < windData.length; i++) {

        if (windData[i].type == "Wind") {
            windExists = true;
            windIndex = i;
            break;
        }
    };

    chartWindObject = windData[windIndex]
    
    for (i = 0; i < chartWindObject.labelBatch.length; i++) {
        let thisTime = new Date(chartWindObject.labelBatch[i]);
        thisTime = thisTime.toLocaleTimeString();
        thisTime = thisTime.split(":");
        hour = thisTime[0];
        chartWindObject.labelBatch[i] = hour;
    }

    var ctx = document.getElementById('myWindChart').getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop(0, 'rgb(0,140,255)');
    grd.addColorStop(1, 'rgb(0,55,255)');
    var chart = new Chart(ctx, {

        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: chartWindObject.labelBatch,
            datasets: [{
                type: 'line',
                label: "Wind Speed (MPH)",
                borderColor: 'rgb(0, 140, 255)',
                data: chartWindObject.dataWindBatch
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
                        min: chartWindObject.chartMinWindLimit, // Set chart bottom 
                        max: chartWindObject.chartMaxWindLimit, // Set chart top 
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
// Function to build wind direction chart page
function buildWindDirectionChart(windData, lake) {
    $("#windDirectionChart").show();

    let chartWindDirectionObject = {
        type: "WindDirection",
        labelBatch: [],
        dataWindDirectionBatch: [],
        chartMinWindDirectionLimit: 35, // y-axis Min Flow value
        chartMaxWinDirectionLimit: 0, // y-axis Max Flow value
        displayCompassSector: ["N", " ", "NE", " ", "E", " ", "SE", " ", "S", " ", "SW", " ", "W", " ", "NW", " "]
    }

    let windIndex = 0;
    for (i = 0; i < windData.length; i++) {

        if (windData[i].type == "WindDirection") {
            windExists = true;
            windIndex = i;
            break;
        }
    };

    chartWindDirectionObject = windData[windIndex];  

    for (i = 0; i < chartWindDirectionObject.labelBatch.length; i++) {
        let thisTime = new Date(chartWindDirectionObject.labelBatch[i]);
        thisTime = thisTime.toLocaleTimeString();
        thisTime = thisTime.split(":");
        hour = thisTime[0];
        chartWindDirectionObject.labelBatch[i] = hour;
    }

    var ctx = document.getElementById('myWindDirectionChart').getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop(0, 'rgb(0,140,255)');
    grd.addColorStop(1, 'rgb(0,55,255)');
    var chart = new Chart(ctx, {

        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: chartWindDirectionObject.labelBatch,
            datasets: [{
                type: 'line',
                label: "Direction",
                borderColor: 'rgb(0, 140, 255)',
                showLine: false,
                data: chartWindDirectionObject.dataWindDirectionBatch
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
                            return chartWindDirectionObject.displayCompassSector[value];
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
            buildElevChart(currentLake.chartData, currentLake);

            // If elevation data is updated more than once a day
            // build hourly elevation chart (river tide) chart
            if (currentLake.refreshInterval < 180) {
                buildRiverChart(currentLake.chartData, currentLake);
                // build hourly flow chart if flows are available
                if (currentLake.data[0].flow !== "N/A")
                    buildHourlyFlowChart(currentLake.chartData, currentLake);
            }

            // build flow chart if flows are available
            if (currentLake.data[0].flow !== "N/A")
                buildFlowChart(currentLake.chartData, currentLake);

        }
        // Add Weather charts

        // Add AirTemp
        buildTempChart(currentLake.chartData, currentLake);

        // Add Barometric pressure
        buildBaroChart(currentLake.chartData, currentLake);

        // Add Windspeed
        buildWindChart(currentLake.chartData, currentLake);

        // Add Windspeed
        buildWindDirectionChart(currentLake.chartData, currentLake);

        // Add Humidity
        buildHumidityChart(currentLake.chartData, currentLake);

        // Add Guidelist
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