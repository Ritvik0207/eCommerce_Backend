const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema({
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
});
const wishlistModel = mongoose.model("wishlists", wishlistSchema);
module.exports = wishlistModel;
