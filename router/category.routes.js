const express = require("express");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createCategory,
  // getCategory,
  deleteCategory,
  updateCategory,
  getCategories,
  getTotalCategoryCount,
} = require("../controller/categoryController");
const categoryModel = require("../models/categoryModel");
// const getCategories = require("../controller/getCategories.controller");
const route = express.Router();

//category router
route.get("/", getCategories);
route.post("/create", upload.single("image"), createCategory);
// route.get("/allcategory", getCategory);
route.delete("/delete/:id", deleteCategory);
route.put("/update/:id", updateCategory);
route.get("/categoryCount", getTotalCategoryCount);
module.exports = route;
