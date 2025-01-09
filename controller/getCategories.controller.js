const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const categoryModel = require('../models/categoryModel');

const getCategories = asyncHandler(async (req, res) => {
  const queries = req.query;
  // Build query object based on filters
  const queryObj = {};

  // Filter by active status
  if (queries?.isActive !== undefined) {
    queryObj.isActive = queries.isActive === 'true';
  }

  // Filter by gender
  if (queries?.gender) {
    queryObj.gender = queries.gender;
  }

  // Filter by kids products
  if (queries?.isProductForKids !== undefined) {
    queryObj.isProductForKids = queries.isProductForKids === 'true';
  }

  // Text search on name
  // In MongoDB, operators start with $ symbol
  // $text operator enables text search across fields that have a text index
  // $search is the text search operator that performs the actual text search
  // This allows searching for categories by name since we created a text index on the name field
  if (queries?.search) {
    queryObj.$text = { $search: queries.search };
  }

  // Pagination
  const page = queries?.page ? Number.parseInt(queries.page) : undefined;
  const limit = queries?.limit ? Number.parseInt(queries.limit) : undefined;
  const skip = page ? (page - 1) * (limit || 10) : undefined;

  console.log(queryObj);
  // Build query
  const categoriesQuery = categoryModel
    .find(queryObj)
    .populate('subCategories')
    .populate('productsCount')
    .skip(skip)
    .limit(limit);

  // Sort
  if (queries.sort) {
    const sortOrder = queries.sort === 'desc' ? -1 : 1;
    categoriesQuery.sort({ displayOrder: sortOrder });
  }

  // Execute query
  const [categories, total] = await Promise.all([
    categoriesQuery.exec(),
    categoryModel.countDocuments(queryObj),
  ]);

  // Return response
  return res.status(200).json({
    success: true,
    count: categories.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    categories,
  });
});

const getCategoryById = asyncHandler(async (req,res)=>{
  const {id} = req.params;
  const category = await categoryModel.findById(id);
  if(!category){
    return res.status(404).json({
      success:false,
      message:'Category not found'
    })
  }
  return res.status(200).json({
    success: true,
    category,
  })
})

module.exports = {
  getCategories,
  getCategoryById
};
