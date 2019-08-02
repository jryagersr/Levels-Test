const mongoose = require("mongoose");
const db = require("../models")();
const lakeSeed = require("../data/lakeData");
const weatherSeed = require("../data/weatherData");



mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost/BassSavvyTestDb"
);

/*db.model('Weather')
  .deleteMany({})
  .then(() => db.model('Weather').collection.insertMany(weatherSeed))
  .then(data => {
    console.log(data.result.n + " Weather records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });*/

db.model('Lake')
  .deleteMany({})
  .then(() => db.model('Lake').collection.insertMany(lakeSeed))
  .then(data => {
    console.log(data.result.n + " lake records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });