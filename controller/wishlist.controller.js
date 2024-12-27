const { default: mongoose } = require('mongoose');
const Wishlist = require('../models/wishlist');
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!mongoose.isValidObjectId(productId)) {
    res.statusCode = 400;
    throw new Error('Invalid product id');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.statusCode = 400;
    throw new Error('Product not found');
  }

  const wishlist = await Wishlist.getByUser(req.user._id);
  // if wishlist is not found, create a new one
  if (!wishlist) {
    const newWishlist = await Wishlist.create({
      user: req.user._id,
      items: [],
    });
    await newWishlist.addItem(productId);
    return res.status(200).json({
      message: 'Wishlist created successfully',
      wishlist: newWishlist,
    });
  }

  await wishlist.addItem(productId);

  res.status(200).json({
    message: 'Product added to wishlist successfully',
    wishlist,
  });
});

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.getByUser(req.user._id);
  res.status(200).json({
    message: 'Wishlist fetched successfully',
    wishlist,
  });
});

const deleteWishlist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.statusCode = 400;
    throw new Error('Invalid wishlist id');
  }

  const wishlist = await Wishlist.findByIdAndDelete(id);

  if (!wishlist) {
    res.statusCode = 400;
    throw new Error('Wishlist not found');
  }

  res.status(200).json({
    message: 'Wishlist deleted successfully',
    wishlist,
  });
});

module.exports = {
  addToWishlist,
  getWishlist,
  deleteWishlist,
};
