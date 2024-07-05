const mongoose = require("mongoose");
const productTypesSchema = new mongoose.Schema(
  {
    types: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("productTypes", productTypesSchema);
