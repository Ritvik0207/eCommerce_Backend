const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    image_id: [
      {
        type: String,
        required: true,
      },
    ],
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
    discount: {
      type: Number,
      default: 0,
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    sizelength: {
      type: String,
      required: true,
    },
    sizewidth: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    isProductForKids: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    fav: {
      type: String,
      default: "No",
      enum: ["Yes", "No"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
    types: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productTypes",
      required: true,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
