const express = require("express");
const asyncHandler = require("express-async-handler");
const {
  createCategory,
  // getCategory,
  deleteCategory,
  updateCategory,
  getCategories,
} = require("../controller/categoryController");
const categoryModel = require("../models/categoryModel");
// const getCategories = require("../controller/getCategories.controller");
const route = express.Router();

//category router
route.get("/", getCategories);
route.post("/create", createCategory);
// route.get("/allcategory", getCategory);
route.delete("/delete/:id", deleteCategory);
route.put("/update/:id", updateCategory);
module.exports = route;
