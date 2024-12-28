const express = require("express");
const {
  createSubCategory,
  getSubCategoryByCategoryId,
  getSubCategoryBySubCategoryId,
  updateSubCategory,
  deleteSubCategory,
} = require("../controller/subCategoryController");

const authenticateAdmin = require("../middlewares/authenticateAdmin");
const { validateObjectId } = require("../middlewares/validateObjectId");

const route = express.Router();
route.post("/create", authenticateAdmin, createSubCategory);
route.get("/category/:categoryId", getSubCategoryByCategoryId);
route.get("/:subCategoryId", getSubCategoryBySubCategoryId);
route.put("/update/:id", validateObjectId, updateSubCategory);
route.delete("/delete/:id", validateObjectId, deleteSubCategory);

module.exports = route;
