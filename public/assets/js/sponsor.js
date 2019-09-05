let sponsors;

function shuffleArray(array)
{
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
            if (element.type == 'logo') {
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
        if (lakeRoute == 'kerr' || lakeRoute == 'jordan' || lakeRoute == 'falls') {

            // Clear any ad content in the scroller
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
        }

        // slideshow carousel function
        // =======================================================
        var slideIndex = 0;
        var x = document.getElementsByClassName("ad-logo");
        var y = document.getElementsByClassName("ad-tx");
        if (typeof x !== 'undefined') {
            x[0].classList.add("active");
            carousel(x, 'ad-logo', 0);
        }
        if (typeof y[0] !== 'undefined') {
            console.log(typeof y[0]);
            y[0].classList.add('active');
            carousel(y, 'ad-tx', 0);
        }

        function carousel(x, className, slideIndex) {
            var x = document.getElementsByClassName(className);
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("active");
                x[i].classList.add("inactive");
            }
            slideIndex++;
            if (slideIndex > x.length) {
                slideIndex = 1
            }
            x[slideIndex - 1].classList.remove("inactive");
            x[slideIndex - 1].classList.add("active");
            setTimeout(function () {
                carousel(x, className, slideIndex);
            }, 7500);
        }

    });