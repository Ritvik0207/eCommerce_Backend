const { default: mongoose } = require("mongoose");
const cartModel = require("../models/cartModel");
const createCart = async (req, res) => {
  try {
    const info = req.body;
    const cart = await cartModel.create(info);
    res.status(201).json({
      success: true,
      message: "cart succesfully created",
      cart,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const cartList = async (req, res) => {
  try {
    const cartlist = await cartModel
      .find()
      .populate({ path: "user_id", options: { strictPopulate: false } })
      .populate({ path: "product_id", options: { strictPopulate: false } })
      .populate({
        path: "product_variant_id",
        options: { strictPopulate: false },
      });
    res.status(201).json({
      success: true,
      message: "cartList succesfully fetch",
      cartlist,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getCartByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await cartModel.find({
      user_id: new mongoose.Types.ObjectId(id),
    });
    res.status(200).json({
      success: true,
      message: "Cart succesfully fetch",
      cart,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
module.exports = {
  createCart,
  cartList,
  getCartByUserId,
};
