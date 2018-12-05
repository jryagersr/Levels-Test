// Function to capitalize first letter of string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Clear the page of any historical data
$("#allLakes").empty();

let currentURL = window.location.origin;

// // Capture the click on a lake
// $('#allLakes').on('click', 'a', function() {
//     // Pull data value
//     var lakeSelect = $(this).attr("data-lake");
//     console.log(lakeSelect);
//     document.cookie = "lakeSelect=" + lakeSelect + "; path=/lakes";
// });


// Capture click on state in dropdown and redirect user to the state URL
$("#allStates").on("click", "button", function () {
    //pull data value and current url
    var currentURL = window.location.origin;
    var state = $(this).attr("data-id");
    window.location.replace(currentURL + "/states/" + state);
})

$("#refresh").on("click", function() {
    let apiURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02079490&period=PT72H&parameterCd=62614&siteType=LK&siteStatus=all";
    $.ajax({
        url: apiURL,
        method: "GET"
    })
        .then(function (data) {
            console.log(data);

            $.ajax({
                url: currentURL + "/api/usgs",
                method: "PUT",
                data: ({data : data})
            })
                .then(function (data) {
                    alert("Data refresh successful!");
                    console.log(data)
                })

        });
})