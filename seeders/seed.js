const mongoose = require("mongoose");
const db = require("../models")();
const lakeSeed = require("../data/lakeData");


mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost/BassSavvyTestDb"
);

db.model('State')
  .deleteMany({})
  .then(() => db.model('State').collection.insertMany(lakeSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });