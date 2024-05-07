const express = require("express");
const { createOrder, getOrder } = require("../controller/orderController");
const route = express.Router();
route.post("/orderCreate", createOrder);
route.get("/getOrder", getOrder);

module.exports = route;
