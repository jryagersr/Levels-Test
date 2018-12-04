// Function to capitalize first letter of string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Clear the page of any historical data
$("#allLakes").empty();

// // Capture the click on a lake
// $('#allLakes').on('click', 'a', function() {
//     // Pull data value
//     var lakeSelect = $(this).attr("data-lake");
//     console.log(lakeSelect);
//     document.cookie = "lakeSelect=" + lakeSelect + "; path=/lakes";
// });


// Capture click on state in dropdown and redirect user to the state URL
$("button").click(function () {
    //pull data value and current url
    var currentURL = window.location.origin;
    var state = $(this).attr("data-id");
    window.location.replace(currentURL + "/states/" + state);
})