const mongoose = require("mongoose");
const productTypesSchema = new mongoose.Schema({
  types: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("productTypes", productTypesSchema);
