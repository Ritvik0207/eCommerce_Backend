const productModel = require("../models/productModel");
const productTypesModel = require("../models/productTypesModel");
const { uploadFile } = require("../upload/upload");
const categoryModel = require("../models/categoryModel");

const createProduct = async (req, res) => {
  try {
    const info = req.body;
    const { files } = req;
    console.log("test", files, info);
    const fieldname = [];
    for (const file of files) {
      console.log(file);
      const fileId = await uploadFile(file);
      fieldname.push(fileId);
    }
    const product = await productModel.create({
      name: info.name,
      description: info.description,
      price: info.price,
      discount: info.discount,
      quantity: info.quantity,
      sizelength: info.sizelength,
      sizewidth: info.sizewidth,
      // color: info.color,
      category: info.category,
      image_id: fieldname,
      types: info.types,
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

const filterByPrice = async (req, res) => {
  try {
    const { new_price = "", category = "" } = req.params;

    const newCategory = category.replace(/([a-z])([A-Z])/g, "$1 $2");

    const priceRange = new_price.split("-");
    if (priceRange.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Invalid price range format.",
      });
    }

    const lowerPrice = Number.parseInt(priceRange[0], 10);
    const upperPrice = Number.parseInt(priceRange[1], 10);

    const categoryProduct = await categoryModel.findOne({ name: newCategory });
    if (!categoryProduct) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    console.log("Category Product:", categoryProduct);

    const products = await productModel
      .find({
        category: categoryProduct._id,
        new_price: { $gte: lowerPrice, $lte: upperPrice },
      })
      .populate("category");

    console.log("Products:", products);

    res.status(200).json({
      success: true,
      message: "Products successfully fetched",
      products,
    });
  } catch (err) {
    console.error("Error occurred in filterByPrice:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products.",
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
    const products = await productModel
      .find(query)
      .populate("category")
      .sort({ createdAt: -1 });

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
const updateProductFav = async (req, res) => {
  try {
    const id = req.params.id;
    const { fav } = req.body;
    console.log(fav);
    const update = await productModel.findByIdAndUpdate(
      id,
      { fav },
      {
        new: true,
      }
    );
    res.status(201).json({
      success: true,
      message: "Item added to wistlist",
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

const createProductTypes = async (req, res) => {
  try {
    const { types } = req.body;
    const productTypesExist = await productTypesModel.findOne({ types });
    console.log("productTypesExist");
    if (productTypesExist) return res.json("ProductTypes exist");
    const productTypes = await new productTypesModel({
      types,
    }).save();
    res.status(201).json({
      success: true,
      message: "productType succesfully Added",
      productTypes,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getProductTypes = async (req, res) => {
  try {
    const { types } = req.params;
    const productType = await productModel.find({ types }).populate("types");
    res.status(200).json({
      success: true,
      message: "productType succesfully fetch",
      productType,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getProductByCategoryId = async (req, res) => {
  try {
    const { name } = req.query;
    console.log(req.params);
    const decodedName = decodeURIComponent(name); // Decode the name parameter

    //Rani-Phee
    const category = await categoryModel.findOne({ name: name });
    //{ name:"rani-phee", _id:"lsjfsd"}
    const product = await productModel.find({ category: category._id });
    console.log(decodedName);
    console.log(category);
    console.log(product);

    res.status(200).json({
      success: true,
      message: "Product category succesfully fetch",
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
  filterByPrice,
  getAllProduct,
  updateProduct,
  updateProductFav,
  deleteProduct,
  getProductById,
  createProductTypes,
  getProductTypes,
  getProductByCategoryId,
};
