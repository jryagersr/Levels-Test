// Exporting an object containing all of our models
var mongoose = require("mongoose");

module.exports = function () {
  // require("./State")(mongoose),
  require("./Lake")(mongoose)
  require("./Weather")(mongoose)
  return mongoose;
};