let kerrLat = 36.588792;
let kerrLon = -78.352668;
let closeLakes = [];
let oldDistance = 0;
let newDistance = 0;
var x = document.getElementById("noLocation");
let lakeData;
let lakeTemplate = '';

// get all of our lake data
$.ajax({
    url: "/api/lake-data",
    method: "GET",
})
    .then(function (data) {
        console.log(data);
        lakeData = data;


        // FUNCTIONS
        // ============================================

        // function to get user's location
        function getLocation(callback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    callback(position.coords.latitude, position.coords.longitude)
                }, showError);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }


        // function to define errors for geolocation (ex: user denies location access)
        function showError(error) {
            // dump any contents in the lake container
            $('#lakeContainer').empty();
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    x.innerHTML = `
                    <p>You've opted out of using location services or have it turned off. Either search using zipcode or enable location permission and try again.</p>
                    <a style="margin-bottom: 20px;" href='/lakes' class='btn btn-success'>View All Lakes</a>
                    <br><a style='color: #0060B6;' href='https://www.lifewire.com/denying-access-to-your-location-4027789' target='_blank'>Help with enabling location services on desktop</a>
                    <br><a style='color: #0060B6;' href='https://help.yahoo.com/kb/SLN24002.html' target='_blank'>Help with enabling location services on mobile</a>`
                    break;
                case error.POSITION_UNAVAILABLE:
                    x.innerHTML = "<p>Location information is unavailable.</p><a href='/lakes' class='btn btn-success'>View All Lakes</a>"
                    break;
                case error.TIMEOUT:
                    x.innerHTML = "<p>The request to get user location timed out.</p><a href='/lakes' class='btn btn-success'>View All Lakes</a>"
                    break;
                case error.UNKNOWN_ERROR:
                    x.innerHTML = "<p>An unknown error occurred.</p><a href='/lakes' class='btn btn-success'>View All Lakes</a>"
                    break;
            }
        }

        function findNearbyLakes(userLat, userLon) {
            closeLakes = [];
            // loop through lake data (right now only NC)
            lakeData.forEach(function (state) {
                state.lakes.forEach(function (lake) {
                    // if lake is not already collected (duplicate)
                    if (!closeLakes.some(e => e.name === lake.bodyOfWater)) {
                        // calculate our distance between user and each lake
                        newDistance = distance(userLat, userLon, lake.lat, lake.long, "M")
                        // collect the first 10 regardless
                        if (closeLakes.length < 10) {
                            closeLakes.push({
                                name: lake.bodyOfWater,
                                distance: newDistance,
                                href: lake.href
                            });
                        }
                        // if ten have already been collected
                        else {
                            // loop through those ten
                            for (var i = 0; i < closeLakes.length; i++) {
                                // and check if the next lake we're looking at is closer
                                if (closeLakes[i].distance > newDistance) {
                                    // if it is splice it into closeLakes (while removing the larger one);
                                    closeLakes.splice(i, 1, { name: lake.bodyOfWater, distance: newDistance, href: lake.href });
                                    break;
                                }
                            }
                        }
                    }
                });
            });
            displayNearbyLakes(userLat, userLon);
        }

        // display nearby lakes
        function displayNearbyLakes(lat, lon) {
            // dump anything currently in the lake container, noLocation container, or template
            $('#lakeContainer').empty();
            $('#noLocation').empty();
            lakeTemplate = `<h6>Lakes near: ${lat}, ${lon}</h6>`;
            // sort by ascending distance
            closeLakes = closeLakes.sort(function (a, b) { return (a.distance - b.distance) });
            // loop through closeLakes and build the template for the page
            closeLakes.forEach(function (lake) {
                lakeTemplate += `
                    <a href=${lake.href}>
                        <div class="lake-card">
                            <h2>${lake.name}</h2>
                            <p>${lake.distance.toFixed(0)} miles away</p>
                        </div>
                    </a>
                `;
            });
            // append template to page
            $('#lakeContainer').append(lakeTemplate);
            // reveal the lake container 
            $('#lakeContainer').show();
        }



        // function to calculate distance between two locations
        // https://www.geodatasource.com/developers/javascript
        // unit = the unit you desire for results
        // where: 'M' is statute miles (default)
        // 'K' is kilometers
        // 'N' is nautical miles
        function distance(lat1, lon1, lat2, lon2, unit) {
            if ((lat1 == lat2) && (lon1 == lon2)) {
                return 0;
            }
            else {
                var radlat1 = Math.PI * lat1 / 180;
                var radlat2 = Math.PI * lat2 / 180;
                var theta = lon1 - lon2;
                var radtheta = Math.PI * theta / 180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180 / Math.PI;
                dist = dist * 60 * 1.1515;
                if (unit == "K") { dist = dist * 1.609344 }
                if (unit == "N") { dist = dist * 0.8684 }
                return dist;
            }
        }



        // USER ACTIONS
        // =========================================================

        // user clicks on use my location button
        $('#locateBtn').on('click', function () {
            // run get location function
            getLocation(function (userLat, userLon) {
                console.log(userLat + ", " + userLon);
                findNearbyLakes(userLat, userLon);
            });
        });

        // user clicks zip code button
        $('#zipBtn').on('click', function (e) {
            e.preventDefault();
            userZip = $('#zipInput').val().trim();
            if (isNaN(userZip) || userZip.length !== 5) {
                $('#validationMessage').text("Not a valid zip code");
            }
            else {
                // remove validation message if present
                $('.right p').empty();
                console.log(userZip);
                $.ajax({
                    url: "/api/zip",
                    method: "GET",
                    data: {
                        userZip: userZip
                    }
                })
                    .then(function (data) {
                        if ($.isEmptyObject(data)) {
                            console.log(data);
                            $('#validationMessage').text("Not a valid zip code");
                        }
                        else {
                            console.log(data);
                            userLat = data.lat;
                            userLon = data.lon;
                            findNearbyLakes(userLat, userLon);
                        }
                    });
            }
        });

    });
