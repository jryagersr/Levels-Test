// Array to hold all of our states and id's to cross check
const states = [{
        state: "Select State",
        id: "default"
    },
    {
        state: "Alabama",
        id: "al"
    },
    {
        state: "Arizona",
        id: "az"
    },
    {
        state: "Arkansas",
        id: "ak"
    },
    {
        state: "California",
        id: "ca"
    },
    {
        state: "Colorado",
        id: "co"
    },
    {
        state: "Florida",
        id: "fl"
    },
    {
        state: "Georgia",
        id: "ga"
    },
    {
        state: "Illinois",
        id: "il"
    },
    {
        state: "Indiana",
        id: "in"
    },
    {
        state: "Iowa",
        id: "ia"
    },
    {
        state: "Kansas",
        id: "ka"
    },
    {
        state: "Kentucky",
        id: "ky"
    },
    {
        state: "Louisiana",
        id: "la"
    },
    {
        state: "Maryland",
        id: "md"
    },
    {
        state: "Michigan",
        id: "mi"
    },
    {
        state: "Maine",
        id: "me"
    },
    {
        state: "Minnesota",
        id: "mn"
    },
    {
        state: "Missouri",
        id: "mo"
    },
    {
        state: "Mississippi",
        id: "mi"
    },
    {
        state: "Nevada",
        id: "nv"
    },
    {
        state: "New Jersey",
        id: "nj"
    },
    {
        state: "New Mexico",
        id: "nm"
    },
    {
        state: "New York",
        id: "ny"
    },

    {
        state: "North Carolina",
        id: "nc"
    },
    {
        state: "Ohio",
        id: "oh"
    },
    {
        state: "Oklahoma",
        id: "ok"
    },
    {
        state: "Oregon",
        id: "or"
    },
    {
        state: "Pennsylvania",
        id: "pa"
    },
    {
        state: "South Carolina",
        id: "sc"
    },
    {
        state: "South Dakota",
        id: "sd"
    },
    {
        state: "Tennessee",
        id: "tn"
    },
    {
        state: "Texas",
        id: "tx"
    },
    {
        state: "Utah",
        id: "ut"
    },
    {
        state: "Vermont",
        id: "vt"
    },
    {
        state: "Virginia",
        id: "va"
    },
    {
        state: "West Virginia",
        id: "wv"
    },
    {
        state: "Wisconsin",
        id: "wi"
    }
]

// Show sponsors
$('#adLogoWell').show();


// Dynamically create options in our dropdown
for (var i = 0; i < states.length; i++) {
    var stateOption = $("<option>");
    stateOption.attr("id", "option-" + i + 1);
    $("#optionWell").append(stateOption);
    $("#option-" + i + 1).append(states[i].state);
};

// Pull the state initials from the end of the current URL
let currentURL = window.location.href;
let state = decodeURI(currentURL.split("/")[4]); // Reduce the string to just our state name
let url = window.location.origin + "/api/states/" + state; // Build url for ajax call

    $.ajax({
        url: "/api/find-one-state",
        method: "GET",
        data: {
            stateName: state
        }
    })
    .then(function (data) {
        console.log(data);
        $("#stateName").append(state);
        for (var i = 0; i < data.length; i++) {
            var row = $(`
            <tr>
            <td class="text-left">
                <a class="lake-link" href="${data[i].href}">
                    <h5>${data[i].bodyOfWater}</h5>
                </a>
            </td>
        </tr>`)
            $("#lakeTable").append(row);
        }
    })

// When an option is selected and user presses view button
// Hide all states, except the one user has selected
$("body").on("click", "#stateSubmit", function () {
    var stateSelected = $('#optionWell option').filter(':selected').text();
    window.location.href = window.location.origin + "/states/" + stateSelected;
    $(".stateContainer").hide();
})