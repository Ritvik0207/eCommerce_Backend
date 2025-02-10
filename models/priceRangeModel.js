const mongoose = require('mongoose');
const { defaultSortPlugin } = require('../utils/mongoosePlugin');

const priceRangeSchema = new mongoose.Schema(
  {
    price_lower: {
      type: Number,
      required: true,
    },
    price_upper: {
      type: Number,
      required: true,
    },
    display_text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

priceRangeSchema.plugin(defaultSortPlugin);
module.exports = mongoose.model('pricerange', priceRangeSchema);
