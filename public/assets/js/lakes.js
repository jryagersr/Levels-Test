
// Function to capitalize first letter of string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Set variable to handle lake name we passed through cookie
// let lakeSelect = getCookie("lakeSelect");

// Clear old page data if it exists
$("#lakeTitle").empty();
$("#currentLevel").empty();
$("#currentDateTime").empty();
$("#lakeSection").empty();


// Pull the state initials from the end of the current URL
let currentURL = window.location.href;
let parsedURL = window.location.href.split("/");
let lakeName = parsedURL[parsedURL.length - 1];
parsedURL = parsedURL.slice(0, parsedURL.length - 2);
let newURL = parsedURL.join("/") + "/api/lakes/" + lakeName
console.log("newURL: " + newURL);

$.ajax({
    url: newURL,
    method: "GET",
    data: { lakeName: lakeName }
})
    .then(function (lakeData) {


        // Drop in the lake title
        $("#lakeTitle").append(capitalizeFirstLetter(lakeData[0].name));
        $("#currentLevel").append("<b>" + lakeData[0].current.level + "</b>");
        $("#currentDateTime").append("As of " + lakeData[0].current.date + " at " + lakeData[0].current.time);


        // Here we are logging the URL so we have access to it for troubleshooting
        console.log("------------------------------------");
        console.log("URL: " + currentURL + "/api/lakes");
        console.log("------------------------------------");

        // Here we then log the NYTData to console, where it will show up as an object.
        console.log(lakeData);
        console.log("------------------------------------");

        // Loop through and display each of the customers
        for (var i = 0; i < lakeData[0].data.length; i++) {

            // Create the HTML Well (Section) and Add the table content for each reserved table
            var lakeSection = $("<tr>");
            lakeSection.addClass("well");
            lakeSection.attr("id", "lakeWell-" + i + 1);
            $("#lakeSection").append(lakeSection);

            var lakeNumber = i + 1;

            // Then display the remaining fields in the HTML (Section Name, Date, URL)

            $("#lakeWell-" + i + 1).append("<td>" + lakeData[0].data[i].date + "</td>");
            $("#lakeWell-" + i + 1).append("<td>" + lakeData[0].data[i].time + "</td>");
            $("#lakeWell-" + i + 1).append("<td>" + lakeData[0].data[i].flow + "</td>");
            $("#lakeWell-" + i + 1).append("<td>" + lakeData[0].data[i].level + "</td>");
        }
    });