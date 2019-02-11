// Advertisements
// ===============================================================

// When user clicks "x" on advertisement it is hidden
// $(".fa-window-close").on("click", function() {
//     $("#ad").hide();
// })

// Hardcoded for now but will need to be dynamic
// var href="http://jacksonsuperiorelectric.com/"
// var src = "/static/assets/img/jsebanner.jpg";
var bottomBannerSponsors = [
    {
        sponsor: "JSE",
        href: "http://jacksonsuperiorelectric.com/",
        src: "/static/assets/img/sponsors/JSE-logo-660px.png",
        endDate: "4/10/19",
    },
    {
        sponsor: "BrucatoFis",
        href: "http://www.brucatofis.com/",
        src: "/static/assets/img/sponsors/brucatonewlogo-660px.png"
    },
    {
        sponsor: "CBC",
        href: "https://www.cattteamtrail.com/",
        src: "/static/assets/img/sponsors/CBC-logo-660px.png"
    }];

// Sponsor Name
// Src: ""
// Href: ""
// Location: 
//    // Pages: [All, State, Tournament]
//    // Lakes: [All, Kerr, Jordan]
// AdType: [All, Bottom-Banner, Top-Logo, Tournament-Logo]

// loop through our sponsor array
bottomBannerSponsors.forEach(function (element) {
    // Create a tag, append to page, and append img tag after
    var a = $("<a target='_blank'>");
    a.attr("href", element.href);
    var adImg = $("<img class='ad-footer-img'>");
    adImg.attr("src", element.src);
    $("#ad").append(a);
    $(a).append(adImg);
})