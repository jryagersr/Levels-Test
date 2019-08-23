var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new LakeSchema object
// This is similar to a Sequelize model
var LakeSchema = new Schema({
  bodyOfWater: {
    type: String,
    required: true
  },
  state: {
    type: Array
  },
  data: {
    type: Array
  },
  ccWxData: {
    type: Array
  },
  ccWxDataLastRefresh: {
    type: String
  },
  wxForecastData: {
    type: Array
  },
  wxForecastDataLastRefresh: {
    type: String
  },
  refreshInterval: {
    type: Number,
  },
  lastRefresh: {
    type: String
  },
  seaLevelDelta: {
    type: Number
  },
  normalPool: {
    type: Number
  },
  lat: {
    type: Number
  },
  long: {
    type: Number
  },
  elevURL: {
    type: String,
    required: true
  },
  flowURL: {
    type: String
  },
  href: {
    type: String,
    required: true
  },
  dataSource: {
    type: Array
  },
  resultsLink: {
    type: String
  }

});

// This creates our model from the above schema, using mongoose's model method
var Lake = mongoose.model("Lake", LakeSchema);

// Export the Lake model
module.exports = Lake;