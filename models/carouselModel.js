const mongoose = require("mongoose");

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
  img_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("carousels", carouselSchema);
