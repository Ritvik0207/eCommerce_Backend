const express = require("express");
const {
  createCart,
  cartList,
  getCartByUserId,
} = require("../controller/cartController");
const route = express.Router();
route.post("/", createCart);
route.get("/", cartList);
route.get("/user/:id", getCartByUserId);

module.exports = route;
