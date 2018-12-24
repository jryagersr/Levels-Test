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
    state: "Oklahoma",
    id: "ok"
},
{
    state: "Minnesota",
    id: "mn"
},
{
    state: "Nevada",
    id: "nv"
},
{
    state: "North Carolina",
    id: "nc"
},
{
    state: "New York",
    id: "ny"
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
    state: "Tennessee",
    id: "tn"
},
{
    state: "Texas",
    id: "tx"
},
{
    state: "Virginia",
    id: "va"
},
{
    state: "Wisconsin",
    id: "wi"
}
]

// Dynamically create options in our dropdown
for (var i = 0; i < states.length; i++) {
    var stateOption = $("<option>");
    stateOption.attr("id", "option-" + i + 1);
    $("#optionWell").append(stateOption);
    $("#option-" + i + 1).append(states[i].state);
};

// When an option is selected and user presses view button
// Hide all states, except the one user has selected
$("button").on("click", function() {
    $(".stateContainer").hide();
    var stateSelected = $('#optionWell option').filter(':selected').text();
    var stateObj = states.find(e => e.state === stateSelected);
    $('#' + stateObj.id).show();
})
