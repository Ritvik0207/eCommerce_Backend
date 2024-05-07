const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  product_variant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productVariants",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
const cartModel = mongoose.model("carts", cartSchema);
module.exports = cartModel;
