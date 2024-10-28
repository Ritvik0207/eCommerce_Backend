const express = require("express");
const asyncHandler = require("express-async-handler");
const {
  getCollection,
  addCollection,
} = require("../controller/collectionController");
const route = express.Router();

route.post("/createcollection", addCollection);
route.get("/allcollection", getCollection);
module.exports = route;
