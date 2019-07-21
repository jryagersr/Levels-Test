var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new WeatherSchema object
// This is similar to a Sequelize model
var WeatherSchema = new Schema({
  bodyOfWater: {
    type: String,
    required: true
  },
  data: {
    type: Array
  },
  refreshInterval: {
    type: Number
  },
  lastRefresh: {
    type: String
  },
  sunrise: {
    type: String
  },
  tempMax: {
    type: String
  },
  tempMin: {
    type: String
  },
  forecast: {
    day1: {
      conditions: {
        type: String
      },
      tempMax: {
        type: Number
      },
      tempMin: {
        type: Number
      },
      visibility: {
        type: Number
      },
      windSpeed: {
        type: Number
      },
      windDirection: {
        type: Number
      },
      humidity: {
        type: Number
      },
      pressure: {
        type: Number
      },
    },
    day2: {
      conditions: {
        type: String
      },
      tempMax: {
        type: Number
      },
      tempMin: {
        type: Number
      },
      visibility: {
        type: Number
      },
      windSpeed: {
        type: Number
      },
      windDirection: {
        type: Number
      },
      humidity: {
        type: Number
      },
      pressure: {
        type: Number
      },
    },
    day3: {
      conditions: {
        type: String
      },
      tempMax: {
        type: Number
      },
      tempMin: {
        type: Number
      },
      visibility: {
        type: Number
      },
      windSpeed: {
        type: Number
      },
      windDirection: {
        type: Number
      },
      humidity: {
        type: Number
      },
      pressure: {
        type: Number
      },
    },
    day4: {
      conditions: {
        type: String
      },
      tempMax: {
        type: Number
      },
      tempMin: {
        type: Number
      },
      visibility: {
        type: Number
      },
      windSpeed: {
        type: Number
      },
      windDirection: {
        type: Number
      },
      humidity: {
        type: Number
      },
      pressure: {
        type: Number
      },
    },
    day5: {
      conditions: {
        type: String
      },
      tempMax: {
        type: Number
      },
      tempMin: {
        type: Number
      },
      visibility: {
        type: Number
      },
      windSpeed: {
        type: Number
      },
      windDirection: {
        type: Number
      },
      humidity: {
        type: Number
      },
      pressure: {
        type: Number
      },
    }
  }

});

// This creates our model from the above schema, using mongoose's model method
var Weather = mongoose.model("Weather", WeatherSchema);

// Export the Weather model
module.exports = Weather;