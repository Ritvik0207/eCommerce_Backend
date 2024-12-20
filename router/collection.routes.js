const express = require("express");
const asyncHandler = require("express-async-handler");
const {
  getCollection,
  addCollection,
} = require("../controller/collection.controller");
const route = express.Router();

route.post("/create", addCollection);
route.get("/allcollection", getCollection);
module.exports = route;
