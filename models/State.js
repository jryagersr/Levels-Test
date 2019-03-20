var mongoose = require("mongoose");

module.exports = function(connection){
  // Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var StateSchema = new Schema({
  // `title` is required and of type String
  state: {
    type: String,
    required: true
  },
    // `lakes` is an object that stores a lakes id
  // The ref property links the ObjectId to the lakes model
  // This allows us to populate the State with the associated lakes
  lakes: {
    type: Array,
    ref: "Lake"
  }

});

// This creates our model from the above schema, using mongoose's model method
var State = connection.model("State", StateSchema);
}

