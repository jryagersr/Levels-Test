$.ajax({
    url: "/api/lake-data",
    method: "GET",
})
    .then(function (data) {
        console.log(data);
        let closeLakes = [];
        let distance = 0;
        let newDistance = 0;
        for (var i = 0; i < data.length; i++) {
            newDistance = distance(lat, lon, data.lat, data.lon, "M");
            if (newDistance < distance) {
                closeLakes.push(data.bodyofWaterName);
            }
        }
    });

        var x = document.getElementById("demo");
        let lat;
        let lon;
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        function showPosition(position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            console.log(lat + ", " + lon);
            console.log(distance(lat, lon, kerrLat, kerrLon, "M"));
        }

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

        let kerrLat = 36.588792;
        let kerrLon = -78.352668;