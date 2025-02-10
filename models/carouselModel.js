const mongoose = require('mongoose');
const { defaultSortPlugin } = require('../utils/mongoosePlugin');

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

carouselSchema.plugin(defaultSortPlugin);

module.exports = mongoose.model('carousels', carouselSchema);
