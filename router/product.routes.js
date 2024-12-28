const express = require("express");
const {
  createProduct,
  getAllProducts,
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
  getCollectionNamesByCategory,
  getCollectionNamesByCategoryAndSubcategory,
  getFilteredProducts,
} = require("../controller/productController");
const multer = require("multer");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

const route = express.Router();
const upload = multer();
//category router
route.post("/create", authenticateAdmin, upload.array("image_id"), createProduct);
route.get("/allproducts", getAllProducts);
route.put("/update/:id", upload.array("image_id"), updateProduct);
route.delete("/delete/:id", deleteProduct);
route.get("/getOneProduct/:id", getProductById);

route.get(
  "/filterbyprice/:category/:subcategory?/:discountedPrice",
  filterByPrice
);
route.get("/filterbyprice/:new_price", filterAllProductByPrice);
route.get("/products/:productId/comments", getProductWithComments);
route.put("/updatefav/:id", updateProductFav);
route.get("/query", getProductById);
route.post("/createProductType", createProductTypes);
route.get("/getproductType/:types", getProductTypes);
route.get("/getProductsCategoryById", getProductsByCategoryId);
route.get("/total", getTotalProductCount);
route.get(
  "/sorted/:categoryId/:subcategoryId?",
  getCollectionNamesByCategoryAndSubcategory
);
route.get("/collectionfiltername", getFilteredProducts);

// route.delete("/delete/:id", deleteCategory);
// route.put("/update/:id", updateCategory);
module.exports = route;
