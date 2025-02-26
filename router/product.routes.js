const express = require("express");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsBySellerId,
  getProductsByShopId,
  createProductTypes,
  getProductTypes,
  updateProductFav,
  filterByPrice,
  filterAllProductByPrice,
  getProductsByCategoryId,
  getTotalProductCount,
  getProductWithComments,
  // getCollectionNamesByCategory,
  getCollectionNamesByCategoryAndSubcategory,
  getFilteredProducts,
  getCarouselProducts,
  changeMarkupPercentage,
} = require("../controller/productController");
const multer = require("multer");
const authenticateAdmin = require("../middlewares/authenticateAdmin");
const { validateObjectId } = require("../middlewares/validateObjectId");

// generating fields for uploading images in createProduct
const generateVariantFields = (maxVariants = 10) => {
  const fields = [{ name: "baseImage", maxCount: 1 }];

  for (let i = 1; i <= maxVariants; i++) {
    fields.push({ name: `variant_${i}`, maxCount: 5 });
  }
  return fields;
};

const router = express.Router();
const upload = multer();
//category router
router.post(
  "/create",
  authenticateAdmin,
  upload.fields(generateVariantFields()),
  createProduct
);
router.get("/allproducts", getAllProducts);
router.get("/carousel", getCarouselProducts);
router.get("/getOneProduct/:id", getProductById);
router.put(
  "/update/:id",
  authenticateAdmin,
  upload.fields(generateVariantFields()),
  updateProduct
);
router.delete(
  "/delete/:id",
  authenticateAdmin,
  validateObjectId,
  deleteProduct
);
router.get("/shop/:id", validateObjectId, getProductsByShopId);
router.get("/seller/:id", validateObjectId, getProductsBySellerId);
router.get(
  "/filterbyprice/:category/:subcategory?/:discountedPrice",
  filterByPrice
);

router.get("/filterbyprice/:new_price", filterAllProductByPrice);
router.get("/products/:productId/comments", getProductWithComments);
router.put("/updatefav/:id", updateProductFav);
router.get("/query", getProductById);
router.post("/createProductType", createProductTypes);
router.get("/getproductType/:types", getProductTypes);
router.get("/getProductsCategoryById", getProductsByCategoryId);
router.get("/total", getTotalProductCount);
router.get("/filterbyprice/:new_price", filterAllProductByPrice);
router.get("/allproduct", getAllProducts);
router.get("/products/:productId/comments", getProductWithComments);
router.put("/update/:id", upload.array("image_id"), updateProduct);
router.put("/updatefav/:id", updateProductFav);
router.delete("/delete/:id", deleteProduct);
router.get("/getOneProduct/:id", getProductById);
router.get("/query", getProductById);
router.post("/createProductType", createProductTypes);
router.get("/getproductType/:types", getProductTypes);
router.get("/getProductsCategoryById", getProductsByCategoryId);
router.get("/total", getTotalProductCount);
router.get(
  "/sorted/:categoryId/:subcategoryId?",
  getCollectionNamesByCategoryAndSubcategory
);
router.get("/collectionfiltername", getFilteredProducts);
router.put("/changeMarkupPercentage", changeMarkupPercentage);

// route.delete("/delete/:id", deleteCategory);
// route.put("/update/:id", updateCategory);
module.exports = router;
