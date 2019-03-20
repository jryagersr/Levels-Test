
module.exports = function (app) {

  // Route to retrieve a single lake's data from db
  app.get("/api/find-one-lake", function (req, res) {

    db.model("State").find({
      //   state : stateName 
      "lakes.href": hrefMatch
    })
      .exec(function (err, data) {
        if (err) {
          res.send("There was a problem querying the database");
        } else {
          console.log(data);
          res.json(data);
        }
      })
  })

}; // End of module.exports