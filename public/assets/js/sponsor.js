let sponsors;

function shuffleArray(array) {
    let max = array.length;
    for (i = 0; i < max; i++) {
        // Pick a new index higher than current for each item in the array
        let r = Math.trunc(Math.random() * Math.trunc(max));

        // Swap item into new spot
        let tempObject = array[r];
        array[r] = array[i];
        array[i] = tempObject;
    }
}

if (typeof lakeRoute == 'undefined') {
    lakeRoute = "";
}

// call the backend and return sponsor data array
$.ajax({
        url: "/api/sponsors",
        method: "GET",
    })
    .then(function (data) {
        let today = new Date();
        sponsors = data;
        shuffleArray(sponsors);

        // ad Logo functions
        // ==================================================

        // // Clear any ad content in the scroller
        $("#adLogoWell").empty();

        // Loop through our ads and append them to the page in format: <li><a><img></a></li>
        sponsors.forEach(function (element) {
            if (element.type == 'logo' || element.type == 'guide') {
                if ((element.location.includes("all") || element.location.includes(lakeRoute) &&
                        (new Date(element.startDate) <= today && new Date(element.endDate) >= today))) {
                    var a = $("<a target='_blank'>");
                    a.attr("href", element.href);
                    var adImg = $("<img class='ad-logo'>");
                    adImg.attr("src", element.src);
                    $("#adLogoWell").append(a);
                    $(a).append(adImg);
                }
            }
        });


        // tx ad functions
        // ==================================================

        // just for temporary purposes only do this on kerr/jordan or falls
        // this is to avoid interfering with other lake's w/ txs
        if (lakeRoute == 'kerr' || lakeRoute == 'jordan' ||
            lakeRoute == 'falls' || lakeRoute == 'norman' ||
            lakeRoute == 'badin' || lakeRoute == 'bigharris' ||
            lakeRoute == 'conroe' || lakeRoute == 'clarkshill' ||
            lakeRoute == 'norman' || lakeRoute == 'tablerock' ||
            lakeRoute == 'murray' || lakeRoute == 'smithmountain' ||
            lakeRoute == 'chickamauga' || lakeRoute == 'dardanelle' ||
            lakeRoute == 'douglas' || lakeRoute == 'guntersville') {

            // Clear any ad content in the tournament scroller
            $("#adTxWell").empty();

            // Loop through our ads and append them to the page in format: <li><a><img></a></li>
            sponsors.forEach(function (element) {
                if ((element.type == 'tournament') &&
                    (new Date(element.startDate) <= today && new Date(element.endDate) >= today)) {
                    if (element.location.includes("all") || element.location.includes(lakeRoute)) {
                        var a = $("<a target='_blank'>");
                        a.attr("href", element.href);
                        var adImg = $("<img class='ad-tx'>");
                        adImg.attr("src", element.src);
                        $("#adTxWell").append(a);
                        $(a).append(adImg);
                    }
                }
            });



            // Clear any ad content in the charity scroller
            $("#charityTxWell").empty();

            // Loop through our ads and append them to the page in format: <li><a><img></a></li>
            sponsors.forEach(function (element) {
                if ((element.type == 'charity') &&
                    (new Date(element.startDate) <= today && new Date(element.endDate) >= today)) {
                    if (element.location.includes("all") || element.location.includes(lakeRoute)) {
                        var a = $("<a target='_blank'>");
                        a.attr("href", element.href);
                        var adImg = $("<img class='ad-chartx'>");
                        adImg.attr("src", element.src);
                        $("#charityTxWell").append(a);
                        $(a).append(adImg);
                    }
                }
            });
        }

        // slideshow carousel function
        // =======================================================
        var slideIndex = 0;

        // Get sponsor banners
        var x = document.getElementsByClassName("ad-logo");

        // Get Tx banners
        var y = document.getElementsByClassName("ad-tx");

        // Get TX banners
        var z = document.getElementsByClassName("ad-chartx");

        if (typeof x !== 'undefined') {
            carousel(x, 'ad-logo', 0, 5000);
        }
        if (typeof y[0] !== 'undefined') {
            carousel(y, 'ad-tx', 0, 8000);
        }
        if (typeof z[0] !== 'undefined') {
            carousel(z, 'ad-chartx', 0, 10000);
        }

        function carousel(localX, className, slideIndex, displayTime) {

            if (slideIndex == 0) {
                localX[localX.length - 1].classList.remove("active");
                localX[localX.length - 1].classList.add("inactive");
            } else {
                localX[slideIndex - 1].classList.remove("active");
                localX[slideIndex - 1].classList.add("inactive");
            }

            if (slideIndex >= localX.length - 1) {
                // Make last sponsor in list active and reset slideIndex
                localX[slideIndex].classList.remove("inactive");
                localX[slideIndex].classList.add("active");
                slideIndex = 0
            } else {
                // Make this sponsor active
                localX[slideIndex].classList.remove("inactive");
                localX[slideIndex].classList.add("active");
                slideIndex++;
            }
            // Wait for ad banner display time before switching banners
            setTimeout(function () {
                carousel(localX, className, slideIndex, 5000);
            }, displayTime);
        }

    });