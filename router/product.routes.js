const express = require("express");
const {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  createProductTypes,
  getProductTypes,
  updateProductFav,
  filterByPrice,
  filterAllProductByPrice,
  getProductsByCategoryId,
  getTotalProductCount,
  getProductWithComments,
} = require("../controller/productController");
const multer = require("multer");

const route = express.Router();
const upload = multer();
//category router
route.post("/create", upload.array("image_id"), createProduct);
route.get("/filterbyprice/:category/:new_price", filterByPrice);
route.get("/filterbyprice/:new_price", filterAllProductByPrice);
route.get("/allproduct", getAllProduct);
route.get("/products/:productId/comments", getProductWithComments);
route.put("/update/:id", updateProduct);
route.put("/updatefav/:id", updateProductFav);
route.delete("/delete/:id", deleteProduct);
route.get("/getOneProduct/:id", getProductById);
route.get("/query", getProductById);
route.post("/createProductType", createProductTypes);
route.get("/getproductType/:types", getProductTypes);
route.get("/getProductsCategoryById", getProductsByCategoryId);
route.get("/total", getTotalProductCount);
// route.delete("/delete/:id", deleteCategory);
// route.put("/update/:id", updateCategory);
module.exports = route;
