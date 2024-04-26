const productVariantModel = require("../models/productVariantModel");
const createProductVariant = async (req, res) => {
  try {
    const info = req.body;
    const variant = await productVariantModel.create(info);
    res.status(201).json({
      success: true,
      message: "ProductVariant succesfully created",
      variant,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getAllProductVariant = async (req, res) => {
  try {
    const productVariant = await productVariantModel.find().populate("product");
    res.status(201).json({
      success: true,
      message: "ProductVariant succesfully fetch",
      productVariant,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const updateProductVariant = async (req, res) => {
  try {
    const id = req.params.id;
    const { color, size, price, quantity, product } = req.body;
    // console.log(data);
    const update = await productVariantModel.findByIdAndUpdate(
      id,
      { ...req.body },
      {
        new: true,
      }
    );
    res.status(201).json({
      success: true,
      message: "Data updated",
      update,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteProductVariant = async (req, res) => {
  try {
    const id = req.params.id;
    const cancel = await productVariantModel.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: "Data successfully Deleted",
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

const getProductVariantById = async (req, res) => {
  try {
    const { id } = req.params;
    const productVariant = await productVariantModel.findById(id);
    res.status(200).json({
      success: true,
      message: "Product succesfully fetch",
      productVariant,
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
  createProductVariant,
  getAllProductVariant,
  updateProductVariant,
  deleteProductVariant,
  getProductVariantById,
};
