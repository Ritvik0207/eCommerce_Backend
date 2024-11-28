const express = require("express");
const {
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controller/subCategoryController");

const Route = express.Router();
Route.post("/createSubCategory", createSubCategory);
Route.get("/:categoryId/getSubCategory", getSubCategory);
Route.put("/update/:id", updateSubCategory);
Route.delete("/delete/:id", deleteSubCategory);
// Route.get("/:categoryId/getSubCategory", getSubCategoryById);
module.exports = Route;
