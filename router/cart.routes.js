const express = require("express");
const { createCart, cartList } = require("../controller/cartController");
const route = express.Router();
route.post("/createcart", createCart);
route.get("/cartlist", cartList);

module.exports = route;
