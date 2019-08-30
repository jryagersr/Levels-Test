// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require("path");


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {




  // HTML GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases the user is shown an HTML page of content
  // ---------------------------------------------------------------------------

  app.get("/states/:state", function(req,res) {    
    let state = req.params.state;
    res.sendFile(path.join(__dirname, "../public/states.html"));
  })

  app.get("/lakes/:lakeName", function(req, res) {
    let lakeName = req.params.lakeName;
    res.sendFile(path.join(__dirname, "../public/thisLake.html"));
  });

  app.get("/nearby-lakes", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/nearby-lakes.html"));
  })

  app.get("/search-lakes", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/search-lakes.html"));
  })

  app.get("/tournaments", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/tournaments.html"));
  })

  app.get("/tournament-results", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/tournament-results.html"));
  })

  app.get("/clubs", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/club-list.html"));
  })

  app.get("/club-submit", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/club-submit.html"));
  })

  app.get("/advertise", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/advertise.html"));
  })

  app.get("/contact", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/contact.html"));
  })

  app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/about.html"));
  })

  app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/login.html"));
  })

  app.get("/register", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/register.html"));
  })
  
  // If no matching route is found default to home
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/home.html"));
  });

  // function loggedIn(req, res, next) {
  //   if (req.user) {
  //     console.log("user is logged in");
  //   }
  //   next();
  //}
};
