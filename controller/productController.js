const productModel = require("../models/productModel");
const productTypesModel = require("../models/productTypesModel");
const { uploadFile } = require("../upload/upload");
const categoryModel = require("../models/categoryModel");
const commentRatingModel = require("../models/commentRatingModel");
const subCategoryModel = require("../models/subCategoryModel");

const createProduct = async (req, res) => {
  try {
    console.log("creating product");
    const info = req.body;
    // console.log(info);
    const { files } = req;
    // console.log("test", files, info);
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

// const filterAllProductByPrice = async (req, res) => {
//   try {
//     const { new_price = "", category = "" } = req.params;

//     const newCategory = category.replace(/([a-z])([A-Z])/g, "$1 $2");

//     const priceRange = new_price.split("-");
//     if (priceRange.length !== 2) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid price range format.",
//         newCategory,
//       });
//     }

//     const lowerPrice = Number.parseInt(priceRange[0], 10);
//     const upperPrice = Number.parseInt(priceRange[1], 10);

//     const products = await productModel
//       .find({
//         new_price: { $gte: lowerPrice, $lte: upperPrice },
//       })
//       .populate("category");

//     console.log("Products:", products);

//     res.status(200).json({
//       success: true,
//       message: "Products successfully fetched",
//       products,
//     });
//   } catch (err) {
//     console.error("Error occurred in filterByPrice:", err);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching products.",
//     });
//   }
// };

const filterAllProductByPrice = async (req, res) => {
  try {
    const { new_price = "" } = req.params;

    // Validate price range
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

    // Fetch products within the price range
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
//old code
// const filterByPrice = async (req, res) => {
//   try {
//     const { new_price = "", category = "" } = req.params;

//     const newCategory = category.replace(/([a-z])([A-Z])/g, "$1 $2");

//     const priceRange = new_price.split("-");
//     if (priceRange.length !== 2) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid price range format.",
//       });
//     }

//     const lowerPrice = Number.parseInt(priceRange[0], 10);
//     const upperPrice = Number.parseInt(priceRange[1], 10);

//     const categoryProduct = await categoryModel.findOne({ name: newCategory });
//     if (!categoryProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found.",
//       });
//     }

//     console.log("Category Product:", categoryProduct);

//     const products = await productModel
//       .find({
//         category: categoryProduct._id,
//         new_price: { $gte: lowerPrice, $lte: upperPrice },
//       })
//       .populate("category");

//     console.log("Products:", products);

//     res.status(200).json({
//       success: true,
//       message: "Products successfully fetched",
//       products,
//     });
//   } catch (err) {
//     console.error("Error occurred in filterByPrice:", err);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching products.",
//     });
//   }
// };

//new code
const mongoose = require("mongoose");

const filterByPrice = async (req, res) => {
  try {
    const { discountedPrice = "", category = "" } = req.params;

    // Log inputs for debugging
    console.log("Category:", category);
    console.log("Price Range:", discountedPrice);

    // Validate inputs
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

    // Extract lower and upper bounds
    const [lowerPrice, upperPrice] = discountedPrice.split("-").map(Number);

    if (isNaN(lowerPrice) || isNaN(upperPrice)) {
      return res.status(400).json({
        success: false,
        message: "Price range must contain valid numbers.",
      });
    }

    let categoryProduct;

    // Check if 'category' is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(category)) {
      console.log("Searching by category ID");
      categoryProduct = await categoryModel.findById(category); // Query by '_id'
    } else {
      console.log("Searching by category name");
      // Replace camelCase or PascalCase category with spaced version
      const newCategory = category.replace(/([a-z])([A-Z])/g, "$1 $2").trim();

      categoryProduct = await categoryModel.findOne({
        name: new RegExp(`^${newCategory}$`, "i"), // Case-insensitive query
      });
    }

    if (!categoryProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    // Log category for debugging
    console.log("Category ID:", categoryProduct._id);

    // Fetch products in the price range
    const products = await productModel
      .find({
        category: categoryProduct._id,
        discountedPrice: { $gte: lowerPrice, $lte: upperPrice },
      })
      .populate("category");

    // Log products for debugging
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
      }); // Category not found, return 404 Not Found response.
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

//for calculating the number of products
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
    const { categoryId, subcategoryId } = req.params; // Get category and subcategory IDs from the URL

    // Build the query based on the presence of categoryId and subcategoryId
    const query = { category: categoryId };
    if (subcategoryId) {
      query.subcategory = subcategoryId;
    }

    // Find products that match the specified category and subcategory IDs, and populate the collection field
    const products = await productModel.find(query).populate("collection");

    // If no products are found, return a 404 response
    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found for the specified category and subcategory",
      });
    }

    // Extract collection names from the products
    const collections = products
      .filter((product) => product.collection) // Filter out products without a collection
      .map((product) => product.collection.name);

    // Remove duplicate collection names
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
};
