const express = require("express");
const {
  createSubCategory,
  getSubCategory,
  getSubCategoryById,
} = require("../controller/subCategoryController");

const Route = express.Router();
Route.post("/createSubCategory", createSubCategory);
Route.get("/:categoryId/getSubCategory", getSubCategory);
// Route.get("/:categoryId/getSubCategory", getSubCategoryById);
module.exports = Route;
