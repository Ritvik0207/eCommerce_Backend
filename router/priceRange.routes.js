const express = require("express");
const {
  createPriceRange,
  getAllPriceRanges,
} = require("../controller/priceRange.controller");
const Route = express.Router();

Route.post("/createpriceranges", createPriceRange);
Route.get("/getpriceranges", getAllPriceRanges);

module.exports = Route;
