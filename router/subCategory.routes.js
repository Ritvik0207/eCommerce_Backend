const express = require("express");
const {
  createSubCategory,
  getSubCategory,
} = require("../controller/subCategoryController");

const Route = express.Router();
Route.post("/createSubCategory", createSubCategory);
Route.get("/:categoryId/getSubCategory", getSubCategory);
module.exports = Route;
