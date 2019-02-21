// // Advertisements
// // ===============================================================

var bottomBannerSponsors = [
    {
        sponsor: "JSE",
        href: "http://jacksonsuperiorelectric.com/",
        src: "/static/assets/img/sponsors/JSE-logo-660px.png"
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
    },
    {
        sponsor: "JSE",
        href: "http://jacksonsuperiorelectric.com/",
        src: "/static/assets/img/sponsors/JSE-logo-660px.png"
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

// Clear any ad content in the scroller
$("#adScrollerBottom").empty();

// Loop through our ads and append them to the page in format: <li><a><img></a></li>

bottomBannerSponsors.forEach(function(element) {
    var li = $("<li>");
    var a = $("<a target='_blank'>");
    a.attr("href", element.href);
    var adImg = $("<img class='ad-scroller-img'>");
    adImg.attr("src", element.src);
    $("#adScrollerBottom").append(li);
    $(li).append(a);
    $(a).append(adImg);
});


// Function code for bottom banner scroller

$(function(){
    var scroller = $('#scroller div.innerScrollArea');
    var scrollerContent = scroller.children('ul');
    scrollerContent.children().clone().appendTo(scrollerContent);
    var curX = 0;
    scrollerContent.children().each(function(){
        var $this = $(this);
        $this.css('left', curX);
        curX += $this.outerWidth(true);
    });
    var fullW = curX / 2;
    var viewportW = scroller.width();

    scroller.css('overflow-x', 'auto');
});

$(function(){
    var scroller = $('#scroller div.innerScrollArea');
    var scrollerContent = scroller.children('ul');
    scrollerContent.children().clone().appendTo(scrollerContent);
    var curX = 0;
    scrollerContent.children().each(function(){
        var $this = $(this);
        $this.css('left', curX);
        curX += $this.outerWidth(true);
    });
    var fullW = curX / 2;
    var viewportW = scroller.width();

    // Scrolling speed management
    var controller = {curSpeed:0, fullSpeed:1};
    var $controller = $(controller);
    var tweenToNewSpeed = function(newSpeed, duration)
    {
        if (duration === undefined)
            duration = 600;
        $controller.stop(true).animate({curSpeed:newSpeed}, duration);
    };

    // Pause on hover
    scroller.hover(function(){
        tweenToNewSpeed(0);
    }, function(){
        tweenToNewSpeed(controller.fullSpeed);
    });

    // Scrolling management; start the automatical scrolling
    var doScroll = function()
    {
        var curX = scroller.scrollLeft();
        var newX = curX + controller.curSpeed;
        if (newX > fullW*2 - viewportW)
            newX -= fullW;
        scroller.scrollLeft(newX);
    };
    setInterval(doScroll, 20);
    tweenToNewSpeed(controller.fullSpeed);
});