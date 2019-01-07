var txBatch = [];
var currentBatch = [];
let parameterArray = [];
let orgSort = false;
let trailSort = false;
let dateSort = false;
let locSort = false;
let rampSort = false;
let stateSort = false;
let filtered = false;

function displayData(data) {
    $("#txSection").empty();
    let i = 0;
    data.forEach(function (element) {

        // Create the HTML Well (Section) and Add the table content for each reserved table
        var txSection = $("<tr>");
        txSection.addClass("well");
        txSection.attr("id", "txWell-" + i + 1);
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
        console.log(data);
        txBatch = data;
        currentBatch = txBatch;
        displayData(txBatch);
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
            displayData(newBatch);
            orgSort ^= true;
            break;

        case "trail":
            var newBatch = currentBatch.sort(sort_by('trail', trailSort, function (a) {
                return a.toUpperCase()
            }));
            displayData(newBatch);
            trailSort ^= true;
            break;

        case "date":
            var newBatch = currentBatch.sort(sort_by('date', dateSort, function (a) {
                return a.toUpperCase()
            }));
            displayData(newBatch);
            dateSort ^= true;
            break;

        case "location":
            var newBatch = currentBatch.sort(sort_by('lake', locSort, function (a) {
                return a.toUpperCase()
            }));
            displayData(newBatch);
            locSort ^= true;
            break;

        case "ramp":
            var newBatch = currentBatch.sort(sort_by('ramp', rampSort, function (a) {
                return a.toUpperCase()
            }));
            displayData(newBatch);
            rampSort ^= true;
            break;

        case "state":
            var newBatch = currentBatch.sort(sort_by('state', stateSort, function (a) {
                return a.toUpperCase()
            }));
            displayData(newBatch);
            stateSort ^= true;
            break;

        default:
            alert("error");
    }
});


//========================================================================================

// Filter data Code Below

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
})

// Define generic filter function
function filterData(batch, category, val, callback) {
    // let filteredBatch = batch.filter(e => e[category] === val);
    let filteredBatch = batch.filter(e => e[category].indexOf(val) !== -1);
    callback(filteredBatch);
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
    let orgSelect = $("#orgSelect").val();
    let locSelect = $("#locSelect").val();
    let trailSelect = $("#trailSelect").val();
    let rampSelect = $("#rampSelect").val();
    let stateSelect = $("#stateSelect").val();
    let filteredBatch = txBatch;

    // Run the necessary filter functions
    if (orgSelect !== "Select Org") {
        filterData(filteredBatch, "organizer", orgSelect, function (newFilteredBatch) {
            filteredBatch = newFilteredBatch;
        });
    }

    if (locSelect !== "Select Location") {
        filterData(filteredBatch, "lake", locSelect, function (newFilteredBatch) {
            filteredBatch = newFilteredBatch;
        });
    }

    if (trailSelect !== "Select Trail") {
        filterData(filteredBatch, "trail", trailSelect, function (newFilteredBatch) {
            filteredBatch = newFilteredBatch;
        });
    }

    if (rampSelect !== "Select Ramp") {
        filterData(filteredBatch, "ramp", rampSelect, function (newFilteredBatch) {
            filteredBatch = newFilteredBatch;
        });
    }

    if (stateSelect !== "Select State") {
        filterData(filteredBatch, "state", stateSelect, function (newFilteredBatch) {
            filteredBatch = newFilteredBatch;
        });
    }

    if (filtered === true) {
        console.log("true fired");
        // Change our working batch holder and display the new filtered data;
        for (var i = 0; i < filteredBatch.length; i++) {
            currentBatch.push(filteredBatch[i]);
        }
        displayData(currentBatch);
    } else {
        displayData(filteredBatch);
        currentBatch = filteredBatch;
        filtered = true;
    }
    // Reset the option field to the default (ex: "Select Org")
    $(".default-option").prop({
        selected: true
    });
});

// // Function to create Parameter buttons inside parameter-well. Function is called after Add button function
// function createParameterBtns () {
//     for (var i = 0; i < parameterArray.length; i++) {
//         var parameterSpan = $("<span>" + parameterArray[i] + "</span>");
//         parameterSpan.addClass("parameter");
//         parameterSpan.attr("id", "pr-" + parameterArray[i]);
//         $("#parameterWell").append(parameterSpan);
//     }
// }


// // Function to save parameters when Add button is clicked
// $("#filterAdd").on("click", function(e) {
//     e.preventDefault();
//     let orgSelect = $("#orgSelect").val();
//     let locSelect = $("#locSelect").val();
//     let trailSelect = $("#trailSelect").val();
//     let rampSelect = $("#rampSelect").val();
//     let stateSelect = $("#stateSelect").val();

//     // If parameter has been selected, add it to our parameter array
//     // Run the necessary filter functions
//     if (orgSelect !== "Select Org") {
//         parameterArray.push(orgSelect);
//     }

//     if (locSelect !== "Select Location") {
//         parameterArray.push(locSelect);
//     }

//     if (trailSelect !== "Select Trail") {
//         parameterArray.push(trailSelect);
//     }

//     if (rampSelect !== "Select Ramp") {
//         parameterArray.push(rampSelect);
//     }

//     if (stateSelect !== "Select State") {
//         parameterArray.push(stateSelect);
//     }

//     createParameterBtns();
// })


// // Clear all filter parameters
// $("#filterClear").on("click", function(e) {
//     e.preventDefault();
//     parameterArray = [];
//     $("#parameterWell").empty();
//     createParameterBtns();
// })