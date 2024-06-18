const express = require("express");
const {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  createProductTypes,
  getProductTypes,
  getProductByCategoryId,
} = require("../controller/productController");
const route = express.Router();
const multer = require("multer");
const upload = multer();
//category router
route.post("/create", upload.array("images"), createProduct);
route.get("/allproduct", getAllProduct);
route.put("/update/:id", updateProduct);
route.delete("/delete/:id", deleteProduct);
route.get("/getOneProduct/:id", getProductById);
route.get("/query", getProductById);
route.post("/createProductType", createProductTypes);
route.get("/getproductType/:types", getProductTypes);
route.get("/getProductCategoryById/:id", getProductByCategoryId);
// route.delete("/delete/:id", deleteCategory);
// route.put("/update/:id", updateCategory);
module.exports = route;
