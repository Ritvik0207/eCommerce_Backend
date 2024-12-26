const mongoose = require('mongoose');
const { ADMIN_ROLES, GENDER } = require('../constants/constants');
const categoryModel = require('../models/categoryModel');
const subCategoryModel = require('../models/subCategoryModel');
const getCategories = require('./getCategories.controller');
// const { uploadFile } = require("../upload/upload");
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
  if (ADMIN_ROLES.SUPER_ADMIN !== req?.admin?.role) {
    res.statusCode = 401;
    throw new Error('Unauthorized');
  }

  const { name, gender, ...restOfTheProperties } = req.body;

  if (!Object.values(GENDER).includes(gender)) {
    res.statusCode = 400;
    throw new Error('Invalid gender');
  }

  const categoryExist = await categoryModel.findOne({
    name,
    gender,
  });

  if (categoryExist) {
    res.statusCode = 400;
    throw new Error('Category already exists');
  }

  const category = await categoryModel.create({
    name,
    gender,
    ...restOfTheProperties,
  });

  res.status(201).json({
    success: true,
    message: 'Category succesfully Added',
    category,
  });
});

// const getCategory = async (req, res) => {
//   try {
//     const category = await categoryModel.find();
//     res
//       .status(200)
//       .json({ success: true, message: "Category succesfully fetch", category });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
// const deleteCategory = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const data = await categoryModel.findByIdAndDelete(id);
//     res
//       .status(200)
//       .json({ success: true, message: "Data Successfully Deleted", data });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

const deleteCategory = asyncHandler(async (req, res) => {
  if (ADMIN_ROLES.SUPER_ADMIN !== req?.admin?.role) {
    res.statusCode = 401;
    throw new Error('Unauthorized');
  }

  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    res.statusCode = 400;
    throw new Error('Invalid category ID');
  }

  // Check if the category exists
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  // FIRST DELETE ALL SUBCATEGORIES ASSOCIATED WITH THIS CATEGORY
  await subCategoryModel.deleteMany({ category: categoryId });

  // Delete the category
  await categoryModel.findByIdAndDelete(categoryId);

  res.status(200).json({
    success: true,
    message: 'Category and its subcategories successfully deleted',
    category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  if (ADMIN_ROLES.SUPER_ADMIN !== req?.admin?.role) {
    res.statusCode = 401;
    throw new Error('Unauthorized');
  }

  const { name, gender, ...restOfTheProperties } = req.body;
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    res.statusCode = 400;
    throw new Error('Invalid category ID');
  }

  const category = await categoryModel.findByIdAndUpdate(
    categoryId,
    {
      name,
      gender,
      ...restOfTheProperties,
    },
    { new: true }
  );

  res.status(201).json({
    success: true,
    message: 'Data updated',
    category,
  });
});

const getTotalCategoryCount = asyncHandler(async (req, res) => {
  const totalCategories = await categoryModel.countDocuments();

  res.status(200).json({
    success: true,
    message: 'Total category count fetched successfully',
    total: totalCategories,
  });
});

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategories,
  getTotalCategoryCount,
};
