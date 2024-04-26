const express = require("express");
const {
  createProductVariant,
  getAllProductVariant,
  updateProductVariant,
  deleteProductVariant,
  getProductVariantById,
} = require("../controller/productVariantController");
const route = express.Router();
route.post("/createVariant", createProductVariant);
route.get("/getProductVariant", getAllProductVariant);
route.patch("/updateVariant/:id", updateProductVariant);
route.delete("/deleteVariant/:id", deleteProductVariant);
route.get("/getOneProductVariant/:id", getProductVariantById);

module.exports = route;
