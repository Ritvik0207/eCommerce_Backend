const productModel = require("../models/productModel");
const productTypesModel = require("../models/productTypesModel");
const { uploadFile } = require("../upload/upload");
const categoryModel = require("../models/categoryModel");
const commentRatingModel = require("../models/commentRatingModel");
const subCategoryModel = require("../models/subCategoryModel");
const mongoose = require("mongoose");
// const sharp = require("sharp");
// const path = require("node:path");
// const fs = require("node:fs");

const createProduct = async (req, res) => {
  try {
    console.log("creating product");
    const info = req.body;
    console.log(info);
    const { files } = req;
    const fieldname = [];
    for (const file of files) {
      console.log(file);
      const fileId = await uploadFile(file);
      fieldname.push(fileId);
    }

    console.log(info, fieldname);
    const product = await productModel.create({
      name: info.name,
      description: info.description,
      price: info.price,
      discount: info.discount,
      discountedPrice: info.discountedPrice,
      productquantity: info.productquantity,
      sizelength: info?.sizelength || 0,
      sizewidth: info?.sizewidth || 0,
      // color: info.color,
      category: info.category,
      image_id: fieldname,
      subcategory: info.subcategory,
      collection: info.collection,
      // types: info.types,
      isProductForKids: info.isProductForKids === "true",
      gender: info.gender,
      fav: info.fav,
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

// const createProduct = async (req, res) => {
//   try {
//     console.log("Creating product...");
//     const info = req.body;
//     const { files } = req;

//     if (!files || files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No files uploaded.",
//       });
//     }

//     const optimizedDir = path.join(__dirname, "../uploads/optimized");

//     // Ensure the optimized directory exists
//     if (!fs.existsSync(optimizedDir)) {
//       fs.mkdirSync(optimizedDir, { recursive: true });
//     }

//     const imagePaths = []; // Initialize an array for image paths

//     for (const file of files) {
//       const safeFileName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");

//       const optimizedImagePath = path.join(
//         __dirname,
//         "../uploads/optimized",
//         `${Date.now()}-${safeFileName}`
//       );

//       // Optimize and save the image
//       await sharp(file.buffer)
//         .resize(800) // Resize to 800px width while maintaining aspect ratio
//         .webp({ quality: 80 }) // Convert to WebP with 80% quality
//         .toFile(optimizedImagePath);

//       // Push as an object with a `path` field
//       imagePaths.push({ path: optimizedImagePath });
//     }

//     // Create the product with the properly formatted `image_id`
//     const product = await productModel.create({
//       name: info.name,
//       description: info.description,
//       price: info.price,
//       discount: info.discount,
//       discountedPrice: info.discountedPrice,
//       productquantity: info.productquantity,
//       sizelength: info?.sizelength || 0,
//       sizewidth: info?.sizewidth || 0,
//       category: info.category,
//       image_id: imagePaths, // Pass the array of objects here
//       subcategory: info.subcategory,
//       collection: info.collection,
//       isProductForKids: info.isProductForKids === "true",
//       gender: info.gender,
//       fav: info.fav,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Product successfully created with optimized images",
//       product,
//     });
//   } catch (err) {
//     console.error("Error in createProduct:", err);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while creating the product.",
//       error: err.message,
//     });
//   }
// };

const filterAllProductByPrice = async (req, res) => {
  try {
    const { new_price = "" } = req.params;

    const priceRange = new_price.split("-");
    if (priceRange.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Invalid price range format. Use 'lower-upper'.",
      });
    }

    const lowerPrice = Number.parseInt(priceRange[0], 10);
    const upperPrice = Number.parseInt(priceRange[1], 10);

    if (Number.isNaN(lowerPrice) || Number.isNaN(upperPrice)) {
      return res.status(400).json({
        success: false,
        message: "Invalid price values. Please provide valid numbers.",
      });
    }

    const products = await productModel
      .find({
        new_price: { $gte: lowerPrice, $lte: upperPrice },
      })
      .populate("category");

    res.status(200).json({
      success: true,
      message: "Products successfully fetched",
      products,
    });
  } catch (err) {
    console.error("Error occurred in filterAllProductByPrice:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products.",
      error: err.message,
    });
  }
};

const filterByPrice = async (req, res) => {
  try {
    const { discountedPrice = "", category = "" } = req.params;

    console.log("Category:", category);
    console.log("Price Range:", discountedPrice);

    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category is required." });
    }

    if (!discountedPrice.includes("-")) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid price range format. Use 'lower-upper' (e.g., '0-1000').",
      });
    }

    const [lowerPrice, upperPrice] = discountedPrice.split("-").map(Number);

    if (Number.isNaN(lowerPrice) || Number.isNaN(upperPrice)) {
      return res.status(400).json({
        success: false,
        message: "Price range must contain valid numbers.",
      });
    }

    let categoryProduct;

    // Check if 'category' is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(category)) {
      console.log("Searching by category ID");
      categoryProduct = await categoryModel.findById(category);
    } else {
      console.log("Searching by category name");
      const newCategory = category.replace(/([a-z])([A-Z])/g, "$1 $2").trim();

      categoryProduct = await categoryModel.findOne({
        name: new RegExp(`^${newCategory}$`, "i"),
      });
    }

    if (!categoryProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    console.log("Category ID:", categoryProduct._id);

    const products = await productModel
      .find({
        category: categoryProduct._id,
        discountedPrice: { $gte: lowerPrice, $lte: upperPrice },
      })
      .populate("category");

    console.log("Products Found:", products);

    res.status(200).json({
      success: true,
      message: "Products successfully fetched.",
      products,
    });
  } catch (err) {
    console.error("Error in filterByPrice:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred.",
      error: err.message,
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
    const { productName } = req.query;
    const query = productName
      ? { name: { $regex: productName, $options: "i" } }
      : {};
    const products = await productModel
      .find(query)
      .populate("category")
      .populate("subcategory")
      .populate("collection")
      .sort({ createdAt: -1 });

    const comments = await commentRatingModel
      .find({ productName })
      .populate("userId", "name");

    res.status(200).json({
      success: true,
      message: "Product with comments successfully fetched",
      products,
      comments,
    });
  } catch (err) {
    console.error("Error occurred in getProductWithComments:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching product with comments",
      error: err.message,
    });
  }

  //   res.status(200).json({
  //     success: true,
  //     message: "Products successfully fetched",
  //     products,
  //   });
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json({
  //     success: false,
  //     message: "Internal server error",
  //     error: err.message,
  //   });
  // }
};

const getProductWithComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel
      .findById(productId)
      .populate("category")
      .populate("collection")
      .populate("subcategory")
      .lean();
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const comments = await commentRatingModel
      .find({ productId })
      .populate("userId", "name");
    // .populate("productId");

    res.status(200).json({
      success: true,
      message: "Product with comments successfully fetched",
      product,
      comments,
    });
  } catch (err) {
    console.error("Error occurred in getProductWithComments:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching product with comments.",
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
const getProductsByCategoryId = async (req, res) => {
  try {
    const { id } = req.query;
    // console.log(req.params);
    // const decodedName = decodeURIComponent(name); // Decode the name parameter

    //Rani-Phee
    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }
    //{ name:"rani-phee", _id:"lsjfsd"}
    const products = await productModel.find({ category: id });
    // console.log(decodedName);
    // console.log(category);
    // console.log(product);

    res.status(200).json({
      success: true,
      message: "Product category succesfully fetch",
      products,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getTotalProductCount = async (req, res) => {
  try {
    const totalProducts = await productModel.countDocuments();
    res.status(200).json({
      success: true,
      message: "Total product count fetched successfully",
      total: totalProducts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching total product count",
      error: err.message,
    });
  }
};

const getCollectionNamesByCategoryAndSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const query = { category: categoryId };
    if (subcategoryId) {
      query.subcategory = subcategoryId;
    }

    const products = await productModel.find(query).populate("collection");

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found for the specified category and subcategory",
      });
    }

    const collections = products
      .filter((product) => product.collection)
      .map((product) => product.collection.name);

    const uniqueCollections = [...new Set(collections)];

    res.status(200).json({
      success: true,
      message: "Collections fetched successfully",
      collections: uniqueCollections,
    });
  } catch (err) {
    console.error("Error in getCollectionNamesByCategoryAndSubcategory:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching collection names.",
      error: err.message,
    });
  }
};

const getFilteredProducts = async (req, res) => {
  try {
    const { categoryId, subcategoryId, collectionName } = req.query;

    console.log("Received query params:", req.query);

    const query = {};
    if (categoryId) query.category = categoryId;
    if (subcategoryId) query.subcategory = subcategoryId;

    const products = await productModel.find(query).populate({
      path: "collection",
      match: { name: collectionName },
    });

    const filteredProducts = products.filter((product) => product.collection);

    if (!filteredProducts.length) {
      return res.status(404).json({
        success: false,
        message: "No products found for the selected filters.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Products successfully fetched.",
      products: filteredProducts,
    });
  } catch (err) {
    console.error("Error in getFilteredProducts:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products.",
      error: err.message,
    });
  }
};

module.exports = {
  createProduct,
  filterByPrice,
  filterAllProductByPrice,
  getAllProduct,
  getProductWithComments,
  updateProduct,
  updateProductFav,
  deleteProduct,
  getProductById,
  createProductTypes,
  getProductTypes,
  getProductsByCategoryId,
  getTotalProductCount,
  getCollectionNamesByCategoryAndSubcategory,
  getFilteredProducts,
};
