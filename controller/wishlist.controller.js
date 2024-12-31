const { default: mongoose } = require('mongoose');
const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/wishlist');
const productModel = require('../models/productModel');
const userModel = require('../models/user');

const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId, variantId } = req.body;

  if (!mongoose.isValidObjectId(productId)) {
    res.statusCode = 400;
    throw new Error('Invalid product id');
  }

  const product = await productModel.findById(productId);
  if (!product) {
    res.statusCode = 400;
    throw new Error('Product not found');
  }

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  // if wishlist is not found, create a new one
  if (!wishlist) {
    const newWishlist = await Wishlist.create({
      user: req.user._id,
      items: [{ product: productId, variantId: variantId }],
    });

    return res.status(200).json({
      message: 'Wishlist created successfully',
      wishlist: newWishlist,
    });
  }

  const exists = wishlist.items.some(
    (item) => item.product.toString() === productId.toString()
  );

  if (exists) {
    // remove the product from the wishlist
    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );
  } else {
    // add the product to the wishlist
    wishlist.items.push({ product: productId, variantId: variantId });
  }

  await wishlist.save();

  res.status(200).json({
    message: 'Product added to wishlist successfully',
    wishlist,
  });
});

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  res.status(200).json({
    message: 'Wishlist fetched successfully',
    wishlist,
  });
});

module.exports = {
  toggleWishlist,
  getWishlist,
};
