const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const categoryModel = require("../models/categoryModel");

const getCategories = asyncHandler(async (req, res) => {
  const queries = req.query;

  let categories = [];

  // converting the isProductForKids to boolean
  const isProductForKids = queries?.isProductForKids
    ? queries.isProductForKids.toLowerCase() === "true"
    : false;

  // if the user wants to get all the categories
  if (!queries?.sex && !isProductForKids) {
    categories = await categoryModel.find().populate("subCategories");
  }

  // if the user wants to get categories based on sex products (including children)
  if (queries?.sex && !isProductForKids) {
    categories = await categoryModel
      .find({
        sex:
          queries.sex.charAt(0).toUpperCase() +
          queries.sex.slice(1).toLowerCase(),
      })
      .populate("subCategories");
  }

  // if the user wants to get categories for both male and female based on age group
  if (!queries?.sex && queries?.isProductForKids) {
    categories = await categoryModel
      .find({
        isProductForKids,
      })
      .populate("subCategories");
  }

  // if the user wants to get categories only for a specific sex and age group
  if (queries?.sex && queries?.isProductForKids) {
    const { sex } = queries;

    categories = await categoryModel
      .find({
        sex: sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase(),
        isProductForKids,
      })
      .populate("subCategories");
  }

  if (!categories) {
    res.statusCode = 404;
    throw new Error("No categories found with given parameters");
  }

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    categories,
  });
});

module.exports = getCategories;
