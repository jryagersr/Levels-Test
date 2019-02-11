var txBatch = [];
var currentBatch = [];
let flatBatch = [];
let parameterArray = [];
let orgSort = false;
let trailSort = false;
let dateSort = false;
let locSort = false;
let rampSort = false;
let stateSort = false;
let filtered = false;

// Function to populate filter with options using tournamentData.js
function populateFilter(data) {
    $("#stateSelect").empty().append("<option class='default-option'>Select State</option>");
    $("#orgSelect").empty().append("<option class='default-option'>Select Org</option>");
    $("#trailSelect").empty().append("<option class='default-option'>Select Trail</option>");
    $("#locSelect").empty().append("<option class='default-option'>Select Location</option>");
    $("#rampSelect").empty().append("<option class='default-option'>Select Ramp</option>");

    var dupeArray = []; // Array to hold our duplicates so none appear inside filter
    var stateArray = []; // Array to hold our states to alphabetize them later
    var locArray = []; // Array to hold our locs to alphabetize them later
    var rampArray = []; // Array to hold our ramps to alphabetize them later
    data.forEach(function (element) {
        for (k = 0; k < element.trails.length; k++) {
            for (l = 0; l < element.trails[k].tournaments.length; l++) {
                let state = element.trails[k].tournaments[l].state;
                let organizer = element.organization;
                let trail = element.trails[k].trail;
                let loc = element.trails[k].tournaments[l].lake;
                let ramp = element.trails[k].tournaments[l].ramp;
                // Only append a new state option to page if it doesn't already exist
                if ($.inArray(state, stateArray) === -1 && state.length == 2) {
                    stateArray.push(state);
                }
                if ($.inArray(organizer, dupeArray) === -1) {
                    var option = $("<option>" + organizer + "</option>");
                    $(option).attr("data-id", organizer);
                    $("#orgSelect").append(option);
                    // Track the new option in dupeArray
                    dupeArray.push(organizer);
                }
                if ($.inArray(organizer + " - " + trail, dupeArray) === -1) {
                    var option = $("<option>" + organizer + " - " + trail + "</option>");
                    $(option).attr("data-id", organizer + " - " + trail);
                    $("#trailSelect").append(option);
                    // Track the new option in dupeArray
                    dupeArray.push(organizer + " - " + trail);
                }
                if ($.inArray(loc, locArray) === -1) {
                    // Track the new option in dupeArray
                    locArray.push(loc);
                }
                if ($.inArray(ramp, rampArray) === -1) {
                    // Track the new option in dupeArray
                    rampArray.push(ramp);
                }
            }
        }
    });

    // state needs to be alphabetized before appending to the filter
    stateArray = stateArray.sort();
    for (var i = 0; i < stateArray.length; i++) {
        var option = $("<option>" + stateArray[i] + "</option>");
        $(option).attr("data-id", stateArray[i]);
        $("#stateSelect").append(option);
    }
    // loc needs to be alphabetized before appending to the filter
    locArray = locArray.sort();
    for (var i = 0; i < locArray.length; i++) {
        var option = $("<option>" + locArray[i] + "</option>");
        $(option).attr("data-id", locArray[i]);
        $("#locSelect").append(option);
    }
    // ramp needs to be alphabetized before appending to the filter
    rampArray = rampArray.sort();
    for (var i = 0; i < rampArray.length; i++) {
        var option = $("<option>" + rampArray[i] + "</option>");
        $(option).attr("data-id", rampArray[i]);
        $("#rampSelect").append(option);
    }
}

// Function to display data
function displayData(data) {
    $("#txSection").empty();
    let i = 0;
    data.forEach(function (element) {
        for (k = 0; k < element.trails.length; k++) {
            for (l = 0; l < element.trails[k].tournaments.length; l++) {

                // Create the row well to hold our HTML
                var txSection = $("<tr>");
                txSection.addClass("well");
                txSection.attr("id", "txWell-" + i + 1);

                let entryLink = element.trails[k].tournaments[l].entryLink;
                let resultsLink = element.trails[k].tournaments[l].resultsLink;

                // check to see if an entryLink exists
                if (entryLink) {
                    txSection.attr("data-url", entryLink); // Add data attribute to the row with entryLink url
                    txSection.addClass("clickable-row"); // Add clickable row css styles
                }

                // Format the tx date to check against today's date
                let date = element.trails[k].tournaments[l].date
                let txDate = new Date(date);
                let todaysDate = new Date();

                // If tx date is after today's Date
                if (txDate.setHours(0, 0, 0, 0) < todaysDate.setHours(0, 0, 0, 0)) {
                    console.log("date checked");
                    // Check to see if a resultsLink exists
                    if (resultsLink) {
                        // Set href as resultsLink
                        txSection.attr("data-url", resultsLink); // Add data attribute to the row with resultsLink url
                        txSection.addClass("results-clickable-row"); // ADd clickable results row css styles
                    }
                    else {
                        // If no resultsLink exists remove the clickable row styles since the tx has passed
                        txSection.removeClass("clickable-row");
                    }
                }

                // Append our row to the table
                $("#txSection").append(txSection);
                // Append each value to the row
                $("#txWell-" + i + 1).append("<td>" + element.organization + "</td>");
                $("#txWell-" + i + 1).append("<td>" + element.trails[k].trail + "</td>");
                $("#txWell-" + i + 1).append("<td>" + element.trails[k].tournaments[l].date + "</td>");
                $("#txWell-" + i + 1).append("<td>" + element.trails[k].tournaments[l].lake + "</td>");
                $("#txWell-" + i + 1).append("<td>" + element.trails[k].tournaments[l].ramp + "</td>");
                i++;
            }
        }
    })
}

// Function to display flat data
function displayFlatData(data) {
    console.log(data);
    $("#txSection").empty();
    let i = 0;
    data.forEach(function (element) {
        // Create the row well to hold our HTML
        var txSection = $("<tr>");
        txSection.addClass("well");
        txSection.attr("id", "txWell-" + i + 1);

        let entryLink = element.entryLink;
        let resultsLink = element.resultsLink;

        // check to see if an entryLink exists
        if (entryLink) {
            txSection.attr("data-url", entryLink); // Add data attribute to the row with entryLink url
            txSection.addClass("clickable-row"); // Add clickable row css styles
        }

        // Format the tx date to check against today's date
        let txDate = new Date(element.date);
        let todaysDate = new Date();

        // If tx date is after today's Date
        if (txDate.setHours(0, 0, 0, 0) < todaysDate.setHours(0, 0, 0, 0)) {
            // Check to see if a resultsLink exists
            if (resultsLink) {
                // Set href as resultsLink
                txSection.attr("data-url", resultsLink); // Add data attribute to the row with resultsLink url
                txSection.addClass("results-clickable-row"); // ADd clickable results row css styles
            }
            else {
                // If no resultsLink exists remove the clickable row styles since the tx has passed
                txSection.removeClass("clickable-row");
            }
        }

        $("#txSection").append(txSection);
        // Append the data values to the table row
        $("#txWell-" + i + 1).append("<td>" + element.organizer + "</td>");
        $("#txWell-" + i + 1).append("<td>" + element.trail + "</td>");
        $("#txWell-" + i + 1).append("<td>" + element.date + "</td>");
        $("#txWell-" + i + 1).append("<td>" + element.lake + "</td>");
        $("#txWell-" + i + 1).append("<td>" + element.ramp + "</td>");
        i++;
    })
}

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
    }
}

function flattenData(data) {
    flatBatch = [];
    data.forEach(function (element) {
        for (k = 0; k < element.trails.length; k++) {
            for (l = 0; l < element.trails[k].tournaments.length; l++) {
                // Push our data into a flat array for easier sort later
                flatBatch.push({
                    organizer: element.organization,
                    trail: element.trails[k].trail,
                    date: element.trails[k].tournaments[l].date,
                    lake: element.trails[k].tournaments[l].lake,
                    ramp: element.trails[k].tournaments[l].ramp,
                    entryLink: element.trails[k].tournaments[l].entryLink,
                    resultsLink: element.trails[k].tournaments[l].resultsLink
                })
            }
        }
    })
}


// API call for tx data for Filtering Tournaments
$.ajax({
    url: "/api/tournaments",
    method: "GET",
})
    .then(function (data) {
        txBatch = data;
        currentBatch = txBatch;
        flattenData(txBatch);
        displayData(txBatch);
        populateFilter(data);
    });



// Capture click on a table header and sort the data before redisplaying
$('#headerRow').on('click', 'th', function () {
    // Pull data value
    var headerSelect = $(this).attr("data-header");

    switch (headerSelect) {

        // If case is org, then run the sort function and create a newBatch, then display using the newBath
        // Change our sort boolean to keep track of asc/desc
        case "organization":
            var newBatch = flatBatch.sort(sort_by('organizer', orgSort, function (a) {
                return a.toUpperCase()
            }));
            displayFlatData(newBatch);
            orgSort ^= true;
            break;

        case "trail":
            var newBatch = flatBatch.sort(sort_by('trail', trailSort, function (a) {
                return a.toUpperCase()
            }));
            displayFlatData(newBatch);
            trailSort ^= true;
            break;

        case "date":
            var newBatch = flatBatch.sort(sort_by('date', dateSort, function (a) {
                return a.toUpperCase()
            }));
            displayFlatData(newBatch);
            dateSort ^= true;
            break;

        case "location":
            var newBatch = flatBatch.sort(sort_by('lake', locSort, function (a) {
                return a.toUpperCase()
            }));
            displayFlatData(newBatch);
            locSort ^= true;
            break;

        case "ramp":
            var newBatch = flatBatch.sort(sort_by('ramp', rampSort, function (a) {
                return a.toUpperCase()
            }));
            displayFlatData(newBatch);
            rampSort ^= true;
            break;

        case "state":
            var newBatch = flatBatch.sort(sort_by('state', stateSort, function (a) {
                return a.toUpperCase()
            }));
            displayFlatData(newBatch);
            stateSort ^= true;
            break;

        default:
            alert("error");
    }
});





// Filter data Code Below
//========================================================================================

$("#clearSubmit").on("click", function (e) {
    e.preventDefault();
    // Reset the page and data
    $("#filterSubmit").show();
    $("#addFilterSubmit").hide();
    $("#newFilterSubmit").hide();
    currentBatch = txBatch;
    displayData(txBatch);
    $("#filterWrapper").toggle();
    filtered = false;
    filteredTags = [];
    flattenData(txBatch);
})

// Define generic filter function
function filterData(batch, category, val, callback) {
    // If we're filtering by organizer
    if (category === "organizer") {
        let filteredBatch = batch.filter(e => e.organization === val);
        callback(filteredBatch);
    }

    // If we're filtering by trail, state, ramp, or loc
    else {
        let filteredBatch = [];
        // The data we want to access is nested so we must first loop by each organization
        batch.forEach(function (element) {
            let organization = element.organization;

            // If we're looking for trails
            if (category === "trail") {
                // within each organization we filter the trails to find a specific one
                let filteredBatch2 = element.trails.filter(e => element.organization + " - " + e.trail === val);
                // If no trail exists, filteredBatch2 will be empty, so we check against that
                if (filteredBatch2.length) {
                    // Push into filteredBatch matching the data structure 
                    filteredBatch.push({
                        organization: organization,
                        trails: filteredBatch2
                    });
                }
                return filteredBatch2;
            }

            // If we're looking for state, ramp, or loc
            else {
                element.trails.forEach(function (e) {
                    let trail = e.trail;
                    let filteredBatch2 = e.tournaments.filter(x => x[category].indexOf(val) > -1)
                    // If no trail exists, filteredBatch2 will be empty, so we check against that
                    if (filteredBatch2.length) {
                        // Push into filteredBatch matching the data structure 
                        filteredBatch.push({
                            organization: organization,
                            trails: [{
                                trail: trail,
                                tournaments: filteredBatch2
                            }]
                        });
                    }
                    return filteredBatch2;
                })
            }
        })
        callback(filteredBatch);
    }
}

// Show or hide filter form
$("#filterWrapper").hide();
$("#filterBtn").on("click", function () {
    $("#filterWrapper").toggle();
})

// Hide additional buttons until first filter has occurred
$("#addFilterSubmit").hide();
$("#newFilterSubmit").hide();

$("#newFilterSubmit").on("click", function (e) {
    e.preventDefault();
    filtered = false;
    currentBatch = [];
    filteredTags = [];
})

// Form submit capture
$(".btn-filter").on("click", function (e) {
    e.preventDefault();
    $("#filterWrapper").toggle();
    $("#filterSubmit").hide();
    $("#addFilterSubmit").show();
    $("#newFilterSubmit").show();
    let orgSelect = $("#orgSelect").find(":selected").data("id");
    let locSelect = $("#locSelect").find(":selected").data("id");
    let trailSelect = $("#trailSelect").find(":selected").data("id");
    let rampSelect = $("#rampSelect").find(":selected").data("id");
    let stateSelect = $("#stateSelect").find(":selected").data("id");
    let filteredBatch = txBatch;

    // Run the necessary filter functions
    if (typeof orgSelect !== 'undefined') {
        filterData(filteredBatch, "organizer", orgSelect, function (newFilteredBatch) {
            filteredBatch = newFilteredBatch;
        });
    }

    if (typeof trailSelect !== 'undefined') {
        filterData(filteredBatch, "trail", trailSelect, function (newFilteredBatch) {
            filteredBatch = newFilteredBatch;
        });
    }

    if (typeof stateSelect !== 'undefined') {
        filterData(filteredBatch, "state", stateSelect, function (newFilteredBatch) {
            filteredBatch = newFilteredBatch;
        });
    }

    if (typeof locSelect !== 'undefined') {
        filterData(filteredBatch, "lake", locSelect, function (newFilteredBatch) {
            filteredBatch = newFilteredBatch;
        });
    }

    if (typeof rampSelect !== 'undefined') {
        filterData(filteredBatch, "ramp", rampSelect, function (newFilteredBatch) {
            filteredBatch = newFilteredBatch;
        });
    }

    if (filtered === true) {
        // Change our working batch holder and display the new filtered data;
        for (var i = 0; i < filteredBatch.length; i++) {
            currentBatch.push(filteredBatch[i]);
        }
        displayData(currentBatch);
        flattenData(currentBatch);
    } else {
        displayData(filteredBatch);
        currentBatch = filteredBatch;
        flattenData(currentBatch);
        filtered = true;
    }
    // Reset the option field to the default (ex: "Select Org")
    $(".default-option").prop({
        selected: true
    });
});



// // Capture table row clicks
// $("#container").on('click-row.bs.table', function (e, row, $element) {
//     window.location = $element.data('url');
// });

$('tbody').on("click", "tr", function () {
    // window.location = $(this).data("url");
    window.open(
        $(this).data("url"),
        '_blank' // <- This is what makes it open in a new window.
    );
});