const mongoose = require("mongoose");
// import mongoose from "mongoose";

const productVariantSchema = mongoose.Schema({
  color: {
    type: String,
    required: [true, "Give the color of the product variant"],
  },
  size: {
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
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
});

const productVariantModel = mongoose.model(
  "productVariants",
  productVariantSchema
);

module.exports = productVariantModel;
