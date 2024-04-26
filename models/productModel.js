const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is compulsory to fill up"],
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.ObjectId,
    ref: "category",
    required: true,
  },
});

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
