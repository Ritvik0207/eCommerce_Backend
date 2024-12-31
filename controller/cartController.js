const { default: mongoose } = require('mongoose');
const cartModel = require('../models/cartModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Product = require('../models/productModel');

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, variantId } = req.body;

  if (!mongoose.isValidObjectId(productId)) {
    res.statusCode = 400;
    throw new Error('Invalid product id');
  }

  // check if product is available
  const product = await Product.findById(productId);
  if (!product) {
    res.statusCode = 400;
    throw new Error('Product not found');
  }

  if (quantity <= 0) {
    res.statusCode = 400;
    throw new Error('Quantity must be greater than 0');
  }

  if (!mongoose.isValidObjectId(req.user._id)) {
    res.statusCode = 400;
    throw new Error('Invalid user id');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.statusCode = 400;
    throw new Error('User not found');
  }

  const cartItem = user.cart.find(
    (item) => item.product.toString() === productId
  );

  if (cartItem) {
    // Update quantity if product exists in the cart
    cartItem.quantity = quantity;
  } else {
    // Add a new product to the cart
    user.cart.push({
      product: productId,
      quantity: quantity,
      variantId: variantId,
    });
  }

  await user.save();
  return res.status(200).json({ success: true, message: 'Cart updated' });
});

const getCart = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req?.user?._id)) {
    res.statusCode = 400;
    throw new Error('Invalid user id');
  }

  const user = await User.findById(req.user._id).populate('cart.product');
  if (!user) {
    res.statusCode = 400;
    throw new Error('User not found');
  }

  return res.status(200).json({ success: true, cart: user.cart });
});

// update cart
const updateCart = asyncHandler(async (req, res) => {
  const { productId, quantity, variantId } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.statusCode = 400;
    throw new Error('User not found');
  }
  const cartItem = user.cart.find(
    (item) => item.product.toString() === productId
  );
  if (!cartItem) {
    const newCartItem = {
      product: productId,
      quantity: quantity,
      variantId: variantId,
    };
    user.cart.push(newCartItem);
  } else {
    cartItem.quantity = quantity;
  }
  await user.save();
  return res.status(200).json({ success: true, message: 'Cart updated' });
});

// clear cart
const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.statusCode = 400;
    throw new Error('User not found');
  }
  user.cart = [];
  await user.save();
  return res.status(200).json({ success: true, message: 'Cart cleared' });
});

// remove from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  // check if product is available in the cart already
  const cartItem = user.cart.find(
    (item) => item.product.toString() === productId
  );
  if (!cartItem) {
    res.statusCode = 400;
    throw new Error('Product not found in the cart');
  }

  // remove the product from the cart
  user.cart = user.cart.filter((item) => item.product.toString() !== productId);
  await user.save();
  return res
    .status(200)
    .json({ success: true, message: 'Product removed from cart' });
});

const cartList = asyncHandler(async (req, res) => {
  const cartlist = await cartModel
    .find()
    .populate({ path: 'user_id', options: { strictPopulate: false } })
    .populate({ path: 'product_id', options: { strictPopulate: false } })
    .populate({
      path: 'product_variant_id',
      options: { strictPopulate: false },
    });
  res.status(201).json({
    success: true,
    message: 'cartList succesfully fetch',
    cartlist,
  });
});

const getCartByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cart = await cartModel.find({
    user_id: new mongoose.Types.ObjectId(id),
  });
  res.status(200).json({
    success: true,
    message: 'Cart succesfully fetch',
    cart,
  });
});

module.exports = {
  cartList,
  getCartByUserId,
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
  clearCart,
};
