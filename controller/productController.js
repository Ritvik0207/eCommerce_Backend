const asyncHandler = require('express-async-handler');
const adminModel = require('../models/adminModel');
const productModel = require('../models/productModel');
const productVariantModel = require('../models/productVariantModel');
const productTypesModel = require('../models/productTypesModel');
const { uploadFile } = require('../upload/upload');
const categoryModel = require('../models/categoryModel');
const commentRatingModel = require('../models/commentRatingModel');
const subCategoryModel = require('../models/subCategoryModel');
const mongoose = require('mongoose');
// const sharp = require("sharp");
// const path = require("node:path");
// const fs = require("node:fs");

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    subcategory,
    shop,
    artisan,
    variants,
    ...rest
  } = req.body;

  const { files } = req;

  // since everything comes as string from frontend, we need to check if the values are falsy values like undefined, null, '', etc. which are not valid for our database
  const falsyValues = [undefined, null, '', 'undefined', 'null'];

  if (
    falsyValues.includes(name) ||
    falsyValues.includes(description) ||
    falsyValues.includes(category) ||
    falsyValues.includes(shop)
  ) {
    res.statusCode = 400;
    throw new Error('Name, description, category, and shop are required');
  }

  if (!mongoose.Types.ObjectId.isValid(category)) {
    res.status(400);
    throw new Error('Invalid category ID');
  }

  if (
    !falsyValues.includes(subcategory) &&
    !mongoose.Types.ObjectId.isValid(subcategory)
  ) {
    res.status(400);
    throw new Error('Invalid subcategory ID');
  }

  if (
    !falsyValues.includes(artisan) &&
    !mongoose.Types.ObjectId.isValid(artisan)
  ) {
    res.status(400);
    throw new Error('Invalid artisan ID');
  }

  if (!files || !files?.baseImage || !files?.baseImage[0]) {
    res.status(400);
    throw new Error('Base image is required');
  }
  const baseImageFile = files?.baseImage[0];
  const fileId = await uploadFile(baseImageFile);
  const baseImage = {
    url: fileId,
    altText: baseImageFile?.originalname,
  };

  const restWithoutFalsyValues = Object.fromEntries(
    Object.entries(rest).filter(([key, value]) => !falsyValues.includes(value))
  );

  // create the product with the base image
  const product = await productModel.create({
    name,
    description,
    category,
    subcategory: !falsyValues.includes(subcategory) ? subcategory : null,
    shop,
    artisan: !falsyValues.includes(artisan) ? artisan : null,
    baseImage,
    ...restWithoutFalsyValues,
  });

  // check if variants is an array and it exists
  if (!Array.isArray(variants) && variants?.length === 0) {
    res.status(400);
    throw new Error('Variants is required');
  }
  // parse the variants list
  const variantList = JSON.parse(variants || '[]');
  const createdVariants = [];

  for (const variant of variantList) {
    const variantKey = `variant_${variant.id}`;
    const variantImages = files[variantKey] || [];
    const images = [];

    for (const file of variantImages) {
      const fileId = await uploadFile(file);
      images.push({
        url: fileId,
        altText: file.originalname,
      });
    }

    // create the variant
    const productVariant = await productVariantModel.create({
      product: product._id,
      isActive: variant.isActive !== undefined ? variant.isActive : true,
      images,
      ...variant,
    });
    createdVariants.push(productVariant);
  }

  res.status(201).json({
    success: true,
    message: 'Product and variants successfully created',
    product,
    variants: createdVariants,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    name,
    description,
    category,
    subcategory,
    shop,
    artisan,
    variants,
    ...rest
  } = req.body;

  const { files } = req;

  // check if product exists
  const existingProduct = await productModel.findById(id);
  if (!existingProduct) {
    res.status(404);
    throw new Error('Product not found');
  }

  const falsyValues = [undefined, null, '', 'undefined', 'null'];

  if (
    (!falsyValues.includes(category) &&
      !mongoose.Types.ObjectId.isValid(category)) ||
    (!falsyValues.includes(subcategory) &&
      !mongoose.Types.ObjectId.isValid(subcategory)) ||
    (!falsyValues.includes(artisan) &&
      !mongoose.Types.ObjectId.isValid(artisan))
  ) {
    res.status(400);
    throw new Error(
      'Invalid ID provided for category, subcategory, or artisan'
    );
  }

  // handle base image update if provided
  let baseImage = existingProduct.baseImage;
  if (files?.baseImage?.[0]) {
    const baseImageFile = files.baseImage[0];
    const fileId = await uploadFile(baseImageFile);
    baseImage = {
      url: fileId,
      altText: baseImageFile.originalname,
    };
  }

  // filter out the falsy values from the rest of the updates
  const restWithoutFalsyValues = Object.fromEntries(
    Object.entries(rest).filter(([key, value]) => !falsyValues.includes(value))
  );

  // update the product
  const updatedProduct = await productModel.findByIdAndUpdate(
    id,
    {
      ...(name && { name }),
      ...(description && { description }),
      ...(category && { category }),
      ...(subcategory && { subcategory }),
      ...(shop && { shop }),
      ...(artisan && { artisan }),
      baseImage,
      ...restWithoutFalsyValues,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // handle variants update if provided
  if (variants) {
    const variantList = JSON.parse(variants);
    const updatedVariants = [];

    // delete existing variants that are not in the new list
    const variantIdsToKeep = variantList.filter((v) => v._id).map((v) => v._id);

    await productVariantModel.deleteMany({
      product: id,
      _id: { $nin: variantIdsToKeep },
    });

    for (const variant of variantList) {
      const variantImages = [];

      if (variant.id) {
        const variantKey = `variant_${variant.id}`;
        const variantFiles = files[variantKey] || [];

        for (const file of variantFiles) {
          const fileId = await uploadFile(file);
          variantImages.push({
            url: fileId,
            altText: file.originalname,
          });
        }
      }

      if (variant._id) {
        // update existing variant
        const updatedVariant = await productVariantModel.findByIdAndUpdate(
          variant._id,
          {
            ...variant,
            ...(variantImages.length > 0 && { images: variantImages }),
          },
          { new: true }
        );
        updatedVariants.push(updatedVariant);
      } else {
        // create new variant
        const newVariant = await productVariantModel.create({
          product: id,
          isActive: variant.isActive !== undefined ? variant.isActive : true,
          images: variantImages,
          ...variant,
        });
        updatedVariants.push(newVariant);
      }
    }

    // fetch the complete updated product with populated fields
    const completeProduct = await productModel
      .findById(id)
      .populate('category')
      .populate('subcategory', 'name')
      .populate('shop')
      .populate('variants');

    res.status(200).json({
      success: true,
      message: 'Product and variants updated successfully',
      product: completeProduct,
      variants: updatedVariants,
    });
  } else {
    // if no variants update, just return the updated product
    const completeProduct = await productModel
      .findById(id)
      .populate('category')
      .populate('subcategory', 'name')
      .populate('shop')
      .populate('variants');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: completeProduct,
    });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await productModel
    .findById(id)
    .setOptions({ virtuals: true });

  if (!product) {
    res.statusCode = 404;
    throw new Error('Product not found');
  }

  // delete all associated variants
  await productVariantModel.deleteMany({ product: id });

  // delete the product
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product and its variants successfully deleted',
  });
});

// Helper functions
const validateObjectId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName} ID`);
  }
};

const buildBasicFilters = (queries, queryObj) => {
  if (queries?.category) {
    validateObjectId(queries.category, 'category');
    queryObj.category = queries.category;
  }
  if (queries?.subcategory) {
    validateObjectId(queries.subcategory, 'subcategory');
    queryObj.subcategory = queries.subcategory;
  }
  if (queries?.shop) {
    validateObjectId(queries.shop, 'shop');
    queryObj.shop = queries.shop;
  }
  return queryObj;
};

const buildStatusFilters = (queries, queryObj) => {
  if (queries?.status) {
    queryObj.status = queries.status;
  }
  if (queries?.isVisible !== undefined) {
    queryObj.isVisible = queries.isVisible === 'true';
  }
  return queryObj;
};

const buildAudienceFilters = (queries, queryObj) => {
  if (queries?.gender) {
    queryObj.gender = queries.gender;
  }
  if (queries?.ageGroup) {
    queryObj.ageGroup = queries.ageGroup;
  }
  return queryObj;
};

const buildSpecificationFilters = (queries, queryObj) => {
  if (queries?.material) {
    queryObj['specifications.material'] = queries.material;
  }
  if (queries?.weaveType) {
    queryObj['specifications.weaveType'] = queries.weaveType;
  }
  if (queries?.craftTechnique) {
    queryObj['specifications.craftTechnique'] = queries.craftTechnique;
  }
  return queryObj;
};

const buildGeographicFilters = (queries, queryObj) => {
  if (queries?.region) {
    queryObj['geographicIndication.region'] = queries.region;
  }
  if (queries?.state) {
    queryObj['geographicIndication.state'] = queries.state;
  }
  if (queries?.isGICertified !== undefined) {
    queryObj['geographicIndication.isGICertified'] =
      queries.isGICertified === 'true';
  }
  return queryObj;
};

const buildFuzzySearch = (searchTerm) => {
  if (!searchTerm) return null;

  // Split search term into words for better fuzzy matching
  const words = searchTerm.split(/\s+/).filter((word) => word.length > 0);

  // Create fuzzy search patterns for each word
  const fuzzyPatterns = words.map((word) => {
    // Allow for character variations and typos
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return `(?=.*${escapedWord})`;
  });

  // Combine patterns with word boundaries and case insensitivity
  // The 'i' flag makes it case insensitive
  // This regex requires ALL words to be present in ANY order
  const regex = new RegExp(fuzzyPatterns.join(''), 'i');

  // Search these fields for matches
  return [
    { name: regex },
    { description: regex },
    { 'specifications.material': regex },
    { 'specifications.weaveType': regex },
    { 'specifications.craftTechnique': regex },
  ];
};

const buildVariantQueries = (queries) => {
  // Example price queries:
  // variants.price.basePrice_gte=1000&variants.price.basePrice_lte=5000 - Get variants with basePrice between 1000-5000
  // variants.price.discountedPrice_gte=800&variants.price.discount_gte=10 - Get variants with discountedPrice >= 800 and discount >= 10%

  const populateQueries = {};

  for (const key of Object.keys(queries)) {
    if (key.includes('.')) {
      const [collection, ...pathParts] = key.split('.');

      // Only process variant related queries
      if (!['variants'].includes(collection)) continue;

      const lastPart = pathParts[pathParts.length - 1];
      const path = [...pathParts];
      let operator = '$eq';
      let value = queries[key];

      const operators = {
        _gte: '$gte',
        _lte: '$lte',
        _gt: '$gt',
        _lt: '$lt',
        _ne: '$ne',
      };

      // Check if query contains any operator
      for (const [symbol, mongoOp] of Object.entries(operators)) {
        if (lastPart.endsWith(symbol)) {
          // Extract base field name without operator
          const baseField = lastPart.replace(symbol, '');
          path[path.length - 1] = baseField;
          operator = mongoOp;

          // Convert numeric fields to Number type
          if (
            [
              'price.basePrice',
              'price.discount',
              'price.discountedPrice',
              'stock.quantity',
            ].includes(path.join('.'))
          ) {
            value = Number(value);
          }
          break;
        }
      }

      // Initialize match object for collection if not exists
      if (!populateQueries[collection]) {
        populateQueries[collection] = { match: {} };
      }

      const fieldPath = path.join('.');

      // Handle multiple conditions for same field
      if (populateQueries[collection].match[fieldPath]) {
        // Merge with existing conditions
        populateQueries[collection].match[fieldPath] = {
          ...populateQueries[collection].match[fieldPath],
          [operator]: value,
        };
      } else {
        // Add new condition
        populateQueries[collection].match[fieldPath] = { [operator]: value };
      }
    }
  }

  return populateQueries;
};

const getAllProducts = asyncHandler(async (req, res) => {
  const queries = req.query;
  let queryObj = {};

  // Build all filters
  queryObj = buildBasicFilters(queries, queryObj);
  queryObj = buildStatusFilters(queries, queryObj);
  queryObj = buildAudienceFilters(queries, queryObj);
  queryObj = buildSpecificationFilters(queries, queryObj);
  queryObj = buildGeographicFilters(queries, queryObj);

  // Add fuzzy search
  if (queries?.search) {
    queryObj.$or = buildFuzzySearch(queries.search);
  }

  // Handle variant queries
  const populateQueries = buildVariantQueries(queries);

  console.log(JSON.stringify(populateQueries, null, 2));

  // Pagination
  const page = Number.parseInt(queries.page) || 1;
  const limit =
    queries.limit === 'none' ? 0 : Number.parseInt(queries.limit) || 10;
  const skip = (page - 1) * limit;

  if (page < 1 || (limit !== 0 && (limit < 1 || limit > 100))) {
    res.status(400);
    throw new Error('Invalid pagination parameters');
  }

  // Build query
  let productsQuery = productModel
    .find(queryObj)
    .setOptions({ virtuals: true });

  // Apply population
  if (populateQueries.variants) {
    productsQuery = productsQuery.populate({
      path: 'variants',
      match: populateQueries.variants.match,
      options: { lean: true, virtuals: true },
    });
  } else {
    productsQuery = productsQuery.populate('variants');
  }

  productsQuery = productsQuery
    .populate('category')
    .populate('subcategory')
    .populate('shop')
    .sort({ _id: -1 })
    .lean({ virtuals: true });

  try {
    // Get all products first to calculate correct pagination for filtered results
    const allProducts = await productsQuery.exec();

    // Apply variant filtering if needed
    const filteredProducts = populateQueries.variants
      ? allProducts.filter((product) => product.variants?.length > 0)
      : allProducts;

    const totalProducts = filteredProducts.length;
    const totalPages = limit === 0 ? 1 : Math.ceil(totalProducts / limit);

    // Apply pagination to filtered results
    const paginatedProducts =
      limit === 0
        ? filteredProducts
        : filteredProducts.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
        hasNextPage: limit === 0 ? false : page < totalPages,
        hasPrevPage: limit === 0 ? false : page > 1,
      },
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error fetching products: ${error.message}`);
  }
});

const getCarouselProducts = asyncHandler(async (req, res) => {
  const products = await productModel
    .find()
    .setOptions({ virtuals: true })
    .populate({
      path: 'variants',
      match: { showInCarousel: true },
      options: { lean: true, virtuals: true },
    })
    .sort({ _id: -1 });

  // Filter out products that have no variants with showInCarousel=true
  const filteredProducts = products.filter(
    (product) => product?.variants?.length > 0
  );

  res.status(200).json({
    success: true,
    products: filteredProducts,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.statusCode = 400;
    throw new Error('Invalid product Id');
  }

  const product = await productModel
    .findById(id)
    .setOptions({ virtuals: true })
    .populate('category')
    .populate('subcategory')
    .populate('shop')
    .populate('variants');

  if (!product) {
    res.statusCode = 404;
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    message: 'Product successfully fetched',
    product,
  });
});

const getProductsByShopId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const products = await productModel
    .find({ shop: id })
    .setOptions({ virtuals: true })
    .populate('category')
    .populate('subcategory')
    .populate('shop')
    .populate('variants');

  if (products.length === 0) {
    res.statusCode = 404;
    throw new Error('No products found for this seller');
  }

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

const getProductsBySellerId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const seller = await adminModel.findById(id);
  if (!seller || !seller.shop) {
    res.statusCode = 404;
    throw new Error('Seller or shop not found');
  }

  const products = await productModel
    .find({ shop: seller.shop })
    .setOptions({ virtuals: true })
    .populate('category')
    .populate('subcategory')
    .populate('shop')
    .populate('variants');

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// const deleteProduct = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const cancel = await productModel.findByIdAndDelete(id);
//     res.status(201).json({
//       success: true,
//       message: "Data successfully Deleted",
//       cancel,
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
//     const updatedData = req.body;

//     // Check for uploaded files
//     if (req.files && req.files.length > 0) {
//       const fileIds = [];
//       for (const file of req.files) {
//         const fileId = await uploadFile(file); // Implement upload logic
//         fileIds.push(fileId); // Collect uploaded file IDs
//       }
//       updatedData.image_id = fileIds; // Store file IDs in the database
//     }

//     // Update product with the new data
//     const updatedProduct = await productModel.findByIdAndUpdate(
//       id,
//       updatedData,
//       { new: true }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       product: updatedProduct,
//     });
//   } catch (err) {
//     console.error("Error in updateProduct:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update product",
//       error: err.message,
//     });
//   }
// };
const filterAllProductByPrice = async (req, res) => {
  try {
    const { new_price = '' } = req.params;

    const priceRange = new_price.split('-');
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
        message: 'Invalid price values. Please provide valid numbers.',
      });
    }

    const products = await productModel
      .find({
        new_price: { $gte: lowerPrice, $lte: upperPrice },
      })
      .setOptions({ virtuals: true })
      .populate('category');

    res.status(200).json({
      success: true,
      message: 'Products successfully fetched',
      products,
    });
  } catch (err) {
    console.error('Error occurred in filterAllProductByPrice:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching products.',
      error: err.message,
    });
  }
};

const filterByPrice = async (req, res) => {
  try {
    const {
      discountedPrice = '',
      category = '',
      subcategory = '',
    } = req.params;

    console.log('Category:', category);
    console.log('Subcategory:', subcategory);
    console.log('Price Range:', discountedPrice);

    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: 'Category is required.' });
    }

    if (!discountedPrice.includes('-')) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid price range format. Use 'lower-upper' (e.g., '0-1000').",
      });
    }

    const [lowerPrice, upperPrice] = discountedPrice.split('-').map(Number);

    if (Number.isNaN(lowerPrice) || Number.isNaN(upperPrice)) {
      return res.status(400).json({
        success: false,
        message: 'Price range must contain valid numbers.',
      });
    }

    let categoryProduct;

    // Check if 'category' is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(category)) {
      console.log('Searching by category ID');
      categoryProduct = await categoryModel.findById(category);
    } else {
      console.log('Searching by category name');
      const newCategory = category.replace(/([a-z])([A-Z])/g, '$1 $2').trim();

      categoryProduct = await categoryModel.findOne({
        name: new RegExp(`^${newCategory}$`, 'i'),
      });
    }

    if (!categoryProduct) {
      return res
        .status(404)
        .json({ success: false, message: 'Category not found.' });
    }

    console.log('Category ID:', categoryProduct._id);

    // Query for products with optional subcategory filter
    const query = {
      category: categoryProduct._id,
      discountedPrice: { $gte: lowerPrice, $lte: upperPrice },
    };

    if (subcategory) {
      query.subcategory = new RegExp(`^${subcategory}$`, 'i'); // Case-insensitive search for subcategory
    }

    const products = await productModel
      .find(query)
      .setOptions({ virtuals: true })
      .populate('category');

    console.log('Products Found:', products);

    res.status(200).json({
      success: true,
      message: 'Products successfully fetched.',
      products,
    });
  } catch (err) {
    console.error('Error in filterByPrice:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred.',
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
      .setOptions({ virtuals: true })
      .populate('category')
      .populate('collection')
      .populate('subcategory')
      .lean();
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    const comments = await commentRatingModel
      .find({ productId })
      .populate('userId', 'name');
    // .populate("productId");

    res.status(200).json({
      success: true,
      message: 'Product with comments successfully fetched',
      product,
      comments,
    });
  } catch (err) {
    console.error('Error occurred in getProductWithComments:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching product with comments.',
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
        virtuals: true,
      }
    );
    res.status(201).json({
      success: true,
      message: 'Item added to wistlist',
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

// const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await productModel.findById(id);
//     res.status(200).json({
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

const createProductTypes = async (req, res) => {
  try {
    const { types } = req.body;
    const productTypesExist = await productTypesModel.findOne({ types });
    console.log('productTypesExist');
    if (productTypesExist) return res.json('ProductTypes exist');
    const productTypes = await new productTypesModel({
      types,
    }).save();
    res.status(201).json({
      success: true,
      message: 'productType succesfully Added',
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
    const productType = await productModel
      .find({ types })
      .setOptions({ virtuals: true })
      .populate('types');
    res.status(200).json({
      success: true,
      message: 'productType succesfully fetch',
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
        message: 'Category not found.',
      });
    }
    //{ name:"rani-phee", _id:"lsjfsd"}
    const products = await productModel
      .find({ category: id })
      .setOptions({ virtuals: true });
    // console.log(decodedName);
    // console.log(category);
    // console.log(product);

    res.status(200).json({
      success: true,
      message: 'Product category succesfully fetch',
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
      message: 'Total product count fetched successfully',
      total: totalProducts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Error occurred while fetching total product count',
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

    const products = await productModel.find(query).populate('collection');

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: 'No products found for the specified category and subcategory',
      });
    }

    const collections = products
      .filter((product) => product.collection)
      .map((product) => product.collection.name);

    const uniqueCollections = [...new Set(collections)];

    res.status(200).json({
      success: true,
      message: 'Collections fetched successfully',
      collections: uniqueCollections,
    });
  } catch (err) {
    console.error('Error in getCollectionNamesByCategoryAndSubcategory:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching collection names.',
      error: err.message,
    });
  }
};

const getFilteredProducts = async (req, res) => {
  try {
    const { categoryId, subcategoryId, collectionName } = req.query;

    console.log('Received query params:', req.query);

    const query = {};
    if (categoryId) query.category = categoryId;
    if (subcategoryId) query.subcategory = subcategoryId;

    const products = await productModel.find(query).populate({
      path: 'collection',
      match: { name: collectionName },
    });

    const filteredProducts = products.filter((product) => product.collection);

    if (!filteredProducts.length) {
      return res.status(404).json({
        success: false,
        message: 'No products found for the selected filters.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Products successfully fetched.',
      products: filteredProducts,
    });
  } catch (err) {
    console.error('Error in getFilteredProducts:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching products.',
      error: err.message,
    });
  }
};

const changeMarkupPercentage = asyncHandler(async (req, res) => {
  const markupPercentage = req.body.markupPercentage || 15;

  const products = await productModel.find({});
  for (const product of products) {
    const variants = await productVariantModel.find({ product: product._id });
    for (const variant of variants) {
      variant.price.markup = markupPercentage;
      await variant.save();
    }
  }
  res.status(200).json({
    success: true,
    message: 'Markup Percentage updated successfully',
  });
});

module.exports = {
  createProduct,
  filterByPrice,
  getProductsBySellerId,
  getProductsByShopId,
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
  getCarouselProducts,
  changeMarkupPercentage,
};
