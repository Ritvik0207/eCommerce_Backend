const express = require("express");
const { 
    createOrder,
    getOrder,
    getOrderById
} = require("../controller/orderController");

const authenticateCustomer = require("../middlewares/authenticateCustomer");
const {validateObjectId} = require("../middlewares/validateObjectId");

const route = express.Router();
route.post("/create", authenticateCustomer, createOrder);
route.get("/getOrder", authenticateCustomer, getOrder);
route.get("/:id", authenticateCustomer, validateObjectId, getOrderById);

module.exports = route;
