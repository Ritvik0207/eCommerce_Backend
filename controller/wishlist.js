const wishlistModel = require("../models/wishlist");
const createList = async (req, res) => {
  try {
    const info = req.body;
    const createwish = await wishlistModel.create(info);
    res.status(201).json({
      success: true,
      message: "wishlist succesfully created",
      createwish,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const list = async (req, res) => {
  try {
    const wishlist = await wishlistModel
      .find()
      .populate({ path: "user_id", options: { strictPopulate: false } })
      .populate({ path: "product_id", options: { strictPopulate: false } })
      .populate({
        path: "product_variant_id",
        options: { strictPopulate: false },
      });
    res.status(201).json({
      success: true,
      message: "ProductVariant succesfully fetch",
      wishlist,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const deleteWist = async (req, res) => {
  try {
    const id = req.params.id;
    const cancel = await wishlistModel.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: "Cart data successfully Deleted",
      cancel,
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
  createList,
  list,
  deleteWist,
};
