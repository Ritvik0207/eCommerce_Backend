const express = require("express");
const {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} = require("../controller/productController");
const route = express.Router();

//category router
route.post("/create", createProduct);
route.get("/allproduct", getAllProduct);
route.put("/update/:id", updateProduct);
route.delete("/delete/:id", deleteProduct);
route.get("/getOneProduct/:id", getProductById);
// route.delete("/delete/:id", deleteCategory);
// route.put("/update/:id", updateCategory);
module.exports = route;
