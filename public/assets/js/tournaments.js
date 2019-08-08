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

// parse the current url to see which tx page we're on
let url = document.URL;
url = url.split('/');
let page = url[url.length - 1];


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
                    $(option).attr("data-id", organizer + ":" + trail);
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

// function to flatten the nested data
function flattenData(data, callback) {
    flatBatch = [];
    data.forEach(function (element) {
        for (k = 0; k < element.trails.length; k++) {
            console.log(element.organization);
            console.log(element.trails[k]);
            console.log(element.trails[k].tournaments);
            for (l = 0; l < element.trails[k].tournaments.length; l++) {
                // Format the tx date to check against today's date
                let txDate = new Date(element.trails[k].tournaments[l].date);
                let todaysDate = new Date();
                // check which page we're on
                if (page === 'tournaments') {
                    // If tx date is in the future (exclude all past dates)
                    if (Date.parse(txDate) > Date.parse(todaysDate)) {
                        // Push our data into a flat array for easier sort later
                        flatBatch.push({
                            organizer: element.organization,
                            trail: element.trails[k].trail,
                            date: element.trails[k].tournaments[l].date,
                            lake: element.trails[k].tournaments[l].lake,
                            ramp: element.trails[k].tournaments[l].ramp,
                            state: element.trails[k].tournaments[l].state,
                            entryLink: element.trails[k].tournaments[l].entryLink,
                            resultsLink: element.trails[k].tournaments[l].resultsLink
                        })
                    }
                }
                else {
                    // If tx date is in the past (exclude all future dates)
                    if (Date.parse(txDate) < Date.parse(todaysDate)) {
                        // Push our data into a flat array for easier sort later
                        flatBatch.push({
                            organizer: element.organization,
                            trail: element.trails[k].trail,
                            date: element.trails[k].tournaments[l].date,
                            lake: element.trails[k].tournaments[l].lake,
                            ramp: element.trails[k].tournaments[l].ramp,
                            state: element.trails[k].tournaments[l].state,
                            entryLink: element.trails[k].tournaments[l].entryLink,
                            resultsLink: element.trails[k].tournaments[l].resultsLink
                        })
                    }
                }
            }
        }
    })
    callback(flatBatch);
}

// Function to display flat data
function displayFlatData(data) {
    $("#txSection").empty();
    let i = 0;
    data.forEach(function (element) {
        // Create the row well to hold our HTML
        var txSection = $("<tr>");
        txSection.addClass("well");
        txSection.attr("id", "txWell-" + i + 1);

        let entryLink = element.entryLink;
        let resultsLink = element.resultsLink;

        if (page === 'tournaments') {

            // Check to see if a entryLink exists
            if (entryLink) {
                // Set href as entryLink
                txSection.attr("data-url", entryLink); // Add data attribute to the row with entryLink url
                txSection.addClass("clickable-row"); // Add clickable row css styles
            }
        }
        else {
            // Check to see if a resultsLink exists
            if (resultsLink) {
                console.log(resultsLink);
                // Set href as resultsLink
                txSection.attr("data-url", resultsLink); // Add data attribute to the row with resultsLink url
                txSection.addClass("clickable-row-results"); // ADd clickable results row css styles
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


// API call for tx data for Filtering Tournaments
$.ajax({
    url: "/api/tournaments",
    method: "GET",
})
    .then(function (data) {
        // if we're on tournament results then swap that date sort
        if (page !== 'tournaments') {
            dateSort = true;
        }
        // Flatten our data so it's easier to work with
        flattenData(data, function () {
            // sort by date when page loads (needs to be changed to be variable);
            var newBatch = flatBatch.sort(sort_by('date', dateSort, function (a) {
                return a.toUpperCase()
            }));
            // display our newly flattened data for the first time (sorted by date);
            displayFlatData(newBatch);
            dateSort ^= true;
            txBatch = newBatch;
            currentBatch = newBatch;
            // displayData(txBatch);
            populateFilter(data);
        });
    });


// Capture click on a table header and sort the data before redisplaying
$('#headerRow').on('click', 'th', function () {
    // Pull data value
    var headerSelect = $(this).attr("data-header");

    switch (headerSelect) {

        // If case is org, then run the sort function and create a newBatch, then display using the newBath
        // Change our sort boolean to keep track of asc/desc
        case "organization":
            var newBatch = currentBatch.sort(sort_by('organizer', orgSort, function (a) {
                return a.toUpperCase()
            }));
            displayFlatData(newBatch);
            orgSort ^= true;
            break;

        case "trail":
            var newBatch = currentBatch.sort(sort_by('trail', trailSort, function (a) {
                return a.toUpperCase()
            }));
            displayFlatData(newBatch);
            trailSort ^= true;
            break;

        case "date":
            var newBatch = currentBatch.sort(sort_by('date', dateSort, function (a) {
                return a.toUpperCase()
            }));
            displayFlatData(newBatch);
            dateSort ^= true;
            break;

        case "location":
            var newBatch = currentBatch.sort(sort_by('lake', locSort, function (a) {
                return a.toUpperCase()
            }));
            displayFlatData(newBatch);
            locSort ^= true;
            break;

        case "ramp":
            var newBatch = currentBatch.sort(sort_by('ramp', rampSort, function (a) {
                return a.toUpperCase()
            }));
            displayFlatData(newBatch);
            rampSort ^= true;
            break;

        case "state":
            var newBatch = currentBatch.sort(sort_by('state', stateSort, function (a) {
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
    displayFlatData(txBatch);
    $("#filterWrapper").toggle();
    filtered = false;
    filteredTags = [];
})

// Define generic filter function
function filterData(batch, category, val, callback) {
    // multiple states could be listed so we need to check separately using .includes
    if (category === "state") {
        let filteredBatch = batch.filter(e => e.state.includes(val));
        callback(filteredBatch);
    }
    else {
        // Filter by the category selected
        let filteredBatch = batch.filter(e => e[category] === val);
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
    // define a second possible org value
    let orgSelect2;
    let locSelect = $("#locSelect").find(":selected").data("id");
    let trailSelect = $("#trailSelect").find(":selected").data("id");
    // if trail was selected, separate the attached org
    if (typeof trailSelect !== 'undefined') {
        let splitTrail = $("#trailSelect").find(":selected").data("id").split(":");
        trailSelect = splitTrail[1];
        orgSelect2 = splitTrail[0];
    }
    let rampSelect = $("#rampSelect").find(":selected").data("id");
    let stateSelect = $("#stateSelect").find(":selected").data("id");
    let filteredBatch = txBatch;

    // Run the necessary filter functions
    if (typeof orgSelect !== 'undefined') {
        filterData(filteredBatch, "organizer", orgSelect, function (newFilteredBatch) {
            filteredBatch = newFilteredBatch;
        });
    }

    if (typeof orgSelect2 !== 'undefined') {
        filterData(filteredBatch, "organizer", orgSelect2, function (newFilteredBatch) {
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
        displayFlatData(currentBatch);
    } else {
        displayFlatData(filteredBatch);
        currentBatch = filteredBatch;
        filtered = true;
    }
    // Reset the option field to the default (ex: "Select Org")
    $(".default-option").prop({
        selected: true
    });
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