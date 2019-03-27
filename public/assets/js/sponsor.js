
let sponsors;

// call the backend and return sponsor data array
$.ajax({
    url: "/api/sponsors",
    method: "GET",
})
    .then(function (data) {
        console.log(data);
        sponsors = data;

        // // Clear any ad content in the scroller
        $("#adLogoWell").empty();

        // Loop through our ads and append them to the page in format: <li><a><img></a></li>
        sponsors.forEach(function (element) {
            if (element.location.includes("all") || element.location.includes(lakeRoute)) {
                var a = $("<a target='_blank'>");
                a.attr("href", element.href);
                var adImg = $("<img class='ad-logo'>");
                adImg.attr("src", element.src);
                $("#adLogoWell").append(a);
                $(a).append(adImg);
            }
        });

        var slideIndex = 0;
        var x = document.getElementsByClassName("ad-logo");
        x[0].classList.add("active");
        carousel();

        function carousel() {
            var i;
            var x = document.getElementsByClassName("ad-logo");
            for (i = 0; i < x.length; i++) {
                x[i].classList.remove("active");
                x[i].classList.add("inactive");
            }
            slideIndex++;
            if (slideIndex > x.length) { slideIndex = 1 }
            x[slideIndex - 1].classList.remove("inactive");
            x[slideIndex - 1].classList.add("active");
            setTimeout(carousel, 3500); // Change image every 2 seconds
        }

    });