const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const carouselSchema = new mongoose.Schema({
  subtitle: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  title2: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});

//Export the model
module.exports = mongoose.model("carousels", carouselSchema);
