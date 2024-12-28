const categoryModel = require("../models/categoryModel");
const subCategoryModel = require("../models/subCategoryModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  // validate required fields
  if (!name || !category) {
    res.statusCode = 400;
    throw new Error("Name and category are required");
  }

  // validate category id
  if (!mongoose.Types.ObjectId.isValid(category)) {
    res.statusCode = 400;
    throw new Error('Invalid category ID');
  }

  // validate if the category exists
  const parentCategory = await categoryModel.findById(category);
  if (!parentCategory) {
    res.statusCode = 404;
    throw new Error("Category not found");
  }

  // check if the subcategory already exists
  const existingSubCategory = await subCategoryModel.findOne({ name, category });
  if (existingSubCategory) {
    res.statusCode = 400;
    throw new Error("Subcategory already exists for this category");
  }

  // create the subcategory
  const subCategory = await subCategoryModel.create({
    name,
    category,
    ...req.body
  });

  parentCategory.subCategories.push(subCategory._id);
  await parentCategory.save();

  res.status(201).json({
    success: true,
    message: "Subcategory created successfully",
    subCategory,
  })
});

const getSubCategoryByCategoryId = asyncHandler(async(req, res) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    res.statusCode = 400;
    throw new Error("Invalid category ID");
  }

  // making sure the category exists
  const parentCategory = await categoryModel.findById(categoryId);
  if (!parentCategory) {
    res.statusCode = 404;
    throw new Error("Category not found");
  }

  // fetch all subcategories for the category
  const subCategories = await subCategoryModel
    .find({ category: categoryId })
    .populate('category')
    .populate('productsCount')
    .sort({ displayOrder: 1});

  if (!subCategories || subCategories.length === 0) {
    res.statusCode = 404;
    throw new Error("No subcategories found for this category");
  }

  res.status(200).json({
    success: true,
    count: subCategories.length,
    subCategories,
  });
});

const getSubCategoryBySubCategoryId = asyncHandler(async(req, res) => {
  const { subCategoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
    res.statusCode = 400;
    throw new Error("Invalid subcategory ID");
  };

  const subCategory = await subCategoryModel
    .findById(subCategoryId)
    .populate('category')
    .populate('productsCount');
  
    if (!subCategory) {
      res.statusCode = 404;
      throw new Error("Subcategory not found");
    }

    res.status(200).json({
      success: true,
      subCategory
    })
  });

const updateSubCategory = asyncHandler(async(req, res) => {
  const { id } = req.params;
  const { name, category, ...rest } = req.body;

  // make sure the subcategory exists
  const subCategory = await subCategoryModel.findById(id);
  if (!subCategory) {
    res.statusCode = 404;
    throw new Error("Subcategory not found");
  };

  // if it's a new category
  if (category && category !== subCategory.category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      res.statusCode = 400;
      throw new Error("Invalid category ID");
    }
    // does this new category exists
    const parentCategory = await categoryModel.findById(category);
    if (!parentCategory) {
      res.statusCode = 404;
      throw new Error("Category not found");
    }
    subCategory.category = category; // the new category is added
  }

  // if it's a new name
  if (name && name !== subCategory.name) {
    // make sure there is no subcategory with same name and same category already
    const existingSubCategory = await subCategoryModel.findOne({
      name,
      category: subCategory.category,
    })
    if (existingSubCategory) {
      res.statusCode = 400;
      throw new Error("Subcategory already exists for this category");
    }
    // if it doesn' exists, update the name
    subCategory.name = name;
  }
  // update other fields if provided
  Object.assign(subCategory, rest);

  //save the updates
  const updatedSubCategory = await subCategory.save();

  res.status(200).json({
    success: true,
    message: "Subcategory updated successfully",
    subCategory: updatedSubCategory,
  })
})

const deleteSubCategory = asyncHandler(async(req, res) => {
  const { id } = req.params;

  const subCategory = await subCategoryModel.findById(id);
  if (!subCategory) {
    res.statusCode = 404;
    throw new Error("Subcategory not found");
  }

  const category = await categoryModel.findById(subCategory.category);
  if (category) {
    category.subCategories = category.subCategories.filter(
      (subCategoryId) => subCategoryId.toString() !== id
    );
    await category.save();
  };

  await subCategory.deleteOne();

  res.status(200).json({
    success: true,
    message: "Subcategory deleted successfully",
  });
})
module.exports = {
  createSubCategory,
  getSubCategoryByCategoryId,
  getSubCategoryBySubCategoryId,
  updateSubCategory,
  deleteSubCategory,
};
