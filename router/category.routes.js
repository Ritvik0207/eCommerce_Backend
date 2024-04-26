const express = require("express");
const {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
} = require("../controller/categoryController");
const route = express.Router();

//category router
route.post("/create", createCategory);
route.get("/allcategory", getCategory);
route.delete("/delete/:id", deleteCategory);
route.put("/update/:id", updateCategory);
module.exports = route;
