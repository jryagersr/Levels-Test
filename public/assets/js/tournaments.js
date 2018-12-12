var txBatch = [];
let orgSort = false;
let trailSort = false;
let dateSort = false;
let locSort = false;
let rampSort = false;

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
        function (x) { return primer(x[field]) } :
        function (x) { return x[field] };
    reverse = !reverse ? 1 : -1;
    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}


// API call for tx data
$.ajax({
    url: "/api/tournaments",
    method: "GET",
})
    .then(function (data) {
        console.log(data);
        txBatch = data;
        displayData(txBatch);
    });



// Capture click on a table header and sort the data before redisplaying
$('#headerRow').on('click', 'th', function () {
    // Pull data value
    var headerSelect = $(this).attr("data-header");
    console.log(headerSelect);

    switch (headerSelect) {

        // If case is org, then run the sort function and create a newBatch, then display using the newBath
        // Change our sort boolean to keep track of asc/desc
        case "organization":
            var newBatch = txBatch.sort(sort_by('organizer', orgSort, function (a) { return a.toUpperCase() }));
            displayData(newBatch);
            orgSort ^= true;
            break;

        case "trail":
            var newBatch = txBatch.sort(sort_by('trail', trailSort, function (a) { return a.toUpperCase() }));
            displayData(newBatch);
            trailSort ^= true;
            break;

        case "date":
            var newBatch = txBatch.sort(sort_by('date', dateSort, function (a) { return a.toUpperCase() }));
            displayData(newBatch);
            dateSort ^= true;
            break;

        case "location":
            var newBatch = txBatch.sort(sort_by('lake', locSort, function (a) { return a.toUpperCase() }));
            displayData(newBatch);
            locSort ^= true;
            break;

        case "ramp":
            var newBatch = txBatch.sort(sort_by('ramp', rampSort, function (a) { return a.toUpperCase() }));
            displayData(newBatch);
            rampSort ^= true;
            break;

        default:
            alert("error");
    }
});