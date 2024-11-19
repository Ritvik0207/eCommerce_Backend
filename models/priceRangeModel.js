const mongoose = require("mongoose");

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

module.exports = mongoose.model("pricerange", priceRangeSchema);
