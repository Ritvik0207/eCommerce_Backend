const productModel = require("../models/productModel");
const { uploadFile } = require("../upload/upload");
const createProduct = async (req, res) => {
  try {
    const info = req.body;
    const { files } = req;
    // console.log(files);
    const fieldname = new Array();
    for (const file of files) {
      console.log(file);
      const fileId = await uploadFile(file);
      fieldname.push(fileId);
    }
    const product = await productModel.create({
      name: info.name,
      description: info.description,
      price: info.price,
      quantity: info.quantity,
      sizelength: info.sizelength,
      sizewidth: info.sizewidth,
      // color: info.color,
      category: info.category,
      image_id: fieldname,
    });
    res.status(201).json({
      success: true,
      message: "Product succesfully created",
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// const getAllProduct = async (req, res) => {
//   try {
//     const product = await productModel.find().populate("category");
//     res.status(201).json({
//       success: true,
//       message: "Product succesfully fetch",
//       product,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// Get and filtering the products
const getAllProduct = async (req, res) => {
  try {
    // Get the product name query parameter from the request
    const { productName } = req.query;

    // Construct the MongoDB query to filter products by product name
    const query = productName
      ? { name: { $regex: productName, $options: "i" } }
      : {};

    // Find products matching the query and populate the category field
    const products = await productModel.find(query).populate("category");

    res.status(200).json({
      success: true,
      message: "Products successfully fetched",
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price, quantity, category } = req.body;
    // console.log(data);
    const update = await productModel.findByIdAndUpdate(
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

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const cancel = await productModel.findByIdAndDelete(id);
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

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    res.status(200).json({
      success: true,
      message: "Product succesfully fetch",
      product,
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
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProductById,
};
