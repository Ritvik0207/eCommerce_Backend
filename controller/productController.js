const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const productVariantModel = require('../models/productVariantModel');
const productTypesModel = require("../models/productTypesModel");
const { uploadFile } = require("../upload/upload");
const categoryModel = require("../models/categoryModel");
const commentRatingModel = require("../models/commentRatingModel");
const subCategoryModel = require("../models/subCategoryModel");
const mongoose = require("mongoose");
// const sharp = require("sharp");
// const path = require("node:path");
// const fs = require("node:fs");

const createProduct = asyncHandler(async(req, res) => {
  const { name, description, category, subcategory, shop, variants, artisan} = req.body;

  const { files } = req;

  if (!name || !description || !category || !shop) {
    res.statusCode = 400;
    throw new Error('Name, description, category, and shop are required');
  }

  if (!mongoose.Types.ObjectId.isValid(category)) {
    res.status(400);
    throw new Error('Invalid category ID');
  }
  
  if (subcategory && !mongoose.Types.ObjectId.isValid(subcategory)) {
    res.status(400);
    throw new Error('Invalid subcategory ID');
  }
  
  if (artisan && !mongoose.Types.ObjectId.isValid(artisan)) {
    res.status(400);
    throw new Error('Invalid artisan ID');
  }

  const images = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const fileId = await uploadFile(file);
      images.push({
        url: fileId,
        altText: file.originalname,
      })
    }
  }

  const product = await productModel.create({
    name,
    description,
    category,
    shop,
    images,
    ...req.body
  })

  // create product variants for the prouct
  const variantList = JSON.parse(variants || '[]');
  const createdVariants = [];
  for (const variant of variantList) {
    const productVariant = await productVariantModel.create({
      product: product._id,
      color: variant.color,
      pattern: variant.pattern,
      size: variant.size,
      price: variant.price,
      stock: variant.stock,
      isActive: variant.isActive !== undefined ? variant.isActive : true,
    })
    createdVariants.push(productVariant);
  }
  res.status(201).json({
    success: true,
    message: 'Product and variants successfully created',
    product,
    variants: createdVariants,
  });
})

const getAllProducts = asyncHandler(async(req, res) => {
  // const { category, subcategory, shop, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const queries = req.queries;

  const queryObj = {};

  if (queries?.category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      res.statusCode = 400;
      throw new Error('Invalid category ID');
    }
    queryObj.category = category;
  }
  if (queries?.subcategory) {
    if (!mongoose.Types.ObjectId.isValid(subcategory)) {
      res.statusCode = 400;
      throw new Error('Invalid subcategory ID');
    }
    queryObj.subcategory = subcategory;
  }
  if (queries?.shop) {
    if (!mongoose.Types.ObjectId.isValid(shop)) {
      res.statusCode = 400;
      throw new Error('Invalid shop ID');
    }
    queryObj.shop = shop;
  }

  // text search on name or description
  if (queries?.search) {
    queryObj.$text = { $search: queries.search};
  }

  //pagination
  const page = queries?.page ? Number.parseInt(queries.page, 10) : 1;
  const limit = queries?.limit ? Number.parseInt(queries.limit, 10) : 10;
  const skip = (page - 1) * limit;

  const productsQuery = productModel
    .find(queryObj)
    .populate('category')
    .populate('subcategory')
    .populate('shop')
    .populate('variants')
    .skip(skip)
    .limit(limit);

  const sortBy = queries?.sortBy || 'createdAt';
  const sortOrder = queries?.sortOrder === 'asc' ? 1 : -1;
  productsQuery.sort({ [sortBy]: sortOrder});

  const [products, total] = await Promise.all([
    productsQuery.exec(),
    productModel.countDocuments(queryObj),
  ]);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total/limit),
    products,
  })
});

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
    const {
      discountedPrice = "",
      category = "",
      subcategory = "",
    } = req.params;

    console.log("Category:", category);
    console.log("Subcategory:", subcategory);
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

    // Query for products with optional subcategory filter
    const query = {
      category: categoryProduct._id,
      discountedPrice: { $gte: lowerPrice, $lte: upperPrice },
    };

    if (subcategory) {
      query.subcategory = new RegExp(`^${subcategory}$`, "i"); // Case-insensitive search for subcategory
    }

    const products = await productModel.find(query).populate("category");

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
// const getAllProduct = async (req, res) => {
//   try {
//     const { productName } = req.query;
//     const query = productName
//       ? { name: { $regex: productName, $options: "i" } }
//       : {};
//     const products = await productModel
//       .find(query)
//       .populate("category")
//       .populate("subcategory")
//       .populate("collection")
//       .sort({ createdAt: -1 });

//     const comments = await commentRatingModel
//       .find({ productName })
//       .populate("userId", "name");

//     res.status(200).json({
//       success: true,
//       message: "Product with comments successfully fetched",
//       products,
//       comments,
//     });
//   } catch (err) {
//     console.error("Error occurred in getProductWithComments:", err);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching product with comments",
//       error: err.message,
//     });
//   }

//   //   res.status(200).json({
//   //     success: true,
//   //     message: "Products successfully fetched",
//   //     products,
//   //   });
//   // } catch (err) {
//   //   console.error(err);
//   //   res.status(500).json({
//   //     success: false,
//   //     message: "Internal server error",
//   //     error: err.message,
//   //   });
//   // }
// };

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

// const updateProduct = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { name, description, price, quantity, category } = req.body;
//     // console.log(data);
//     const update = await productModel.findByIdAndUpdate(
//       id,
//       { ...req.body },
//       {
//         new: true,
//       }
//     );
//     res.status(201).json({
//       success: true,
//       message: "Data updated",
//       update,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const info = req.body;
//     const fileObject = req.file;
//     const product = await productModel.findById(id);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     const updatedFields = {
//       subtitle: info.subtitle || carousel.subtitle,
//       title: info.title || carousel.title,
//       title2: info.title2 || carousel.title2,
//     };

//     // If a new file is provided, upload it and replace the image ID
//     if (fileObject) {
//       const fieldname = await uploadFile(fileObject);
//       updatedFields.img_id = fieldname;
//     }

//     const updatedCarousel = await carouselModel.findByIdAndUpdate(
//       id,
//       updatedFields,
//       {
//         new: true, // Return the updated document
//       }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Carousel successfully updated",
//       carousel: updatedCarousel,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Check for uploaded files
    if (req.files && req.files.length > 0) {
      const fileIds = [];
      for (const file of req.files) {
        const fileId = await uploadFile(file); // Implement upload logic
        fileIds.push(fileId); // Collect uploaded file IDs
      }
      updatedData.image_id = fileIds; // Store file IDs in the database
    }

    // Update product with the new data
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Error in updateProduct:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: err.message,
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
  getAllProducts,
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
