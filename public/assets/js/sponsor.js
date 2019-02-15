// Advertisements
// ===============================================================

// When user clicks "x" on advertisement it is hidden
// $(".fa-window-close").on("click", function() {
//     $("#ad").hide();
// })

// Hardcoded for now but will need to be dynamic
var href = "http://jacksonsuperiorelectric.com/"
var src = "/static/assets/img/jsebanner.jpg";

var bottomBannerSponsors = [
    {
        sponsor: "JSE",
        href: "http://jacksonsuperiorelectric.com/",
        src: "/static/assets/img/sponsors/JSE-logo-660px.png"
    },
    {
        sponsor: "BrucatoFis",
        href: "http://www.brucatofis.com/",
        src: "/static/assets/img/brucatobanner.png"
    },
    {
        sponsor: "CBC",
        href: "https://www.cattteamtrail.com/",
        src: "/static/assets/img/sponsors/CBC-logo-660px.png"
    },
    {
        sponsor: "JSE",
        href: "http://jacksonsuperiorelectric.com/",
        src: "/static/assets/img/sponsors/JSE-logo-660px.png"
    },
    {
        sponsor: "BrucatoFis",
        href: "http://www.brucatofis.com/",
        src: "/static/assets/img/brucatobanner.png"
    },
    {
        sponsor: "CBC",
        href: "https://www.cattteamtrail.com/",
        src: "/static/assets/img/sponsors/CBC-logo-660px.png"
    }];


// Create a tag, append to page, and append img tag after
// bottomBannerSponsors.forEach(function(element) {
//     var a = $("<a target='_blank'>");
//     a.attr("href", element.href);
//     var adImg = $("<img class='ad-footer-img'>");
//     adImg.attr("src", element.src);
//     $("#ad").append(a);
//     $(a).append(adImg);
// })


// <li class="slide showing">Slide 1</li>
// <li class="slide">Slide 2</li>
// <li class="slide">Slide 3</li>
// <li class="slide">Slide 4</li>
// <li class="slide">Slide 5</li>

bottomBannerSponsors.forEach(function(element) {
    var li = $("<li>");
    li.addClass("slide");
    var a = $("<a target='_blank'>");
    a.attr("href", element.href);
    var adImg = $("<img class='ad-footer-img'>");
    adImg.attr("src", element.src);
    $("#slides").append(li);
    $(li).append(a);
    $(a).append(adImg);
});

var slides = document.querySelectorAll('#slides .slide');
var currentSlide = 0;
var slideInterval = setInterval(nextSlide,2000);

function nextSlide() {
    slides[currentSlide].className = 'slide';
    currentSlide = (currentSlide+1)%slides.length;
    slides[currentSlide].className = 'slide showing';
}

// var a = $("<a target='_blank'>");
// a.attr("href", element.href);
// var adImg = $("<img class='ad-footer-img'>");
// adImg.attr("src", element.src);
// $("#ad").append(a);
// $(a).append(adImg);
