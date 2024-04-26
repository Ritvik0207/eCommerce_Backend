const express = require("express");
const { list, createList, deleteWist } = require("../controller/wishlist");
const route = express.Router();
route.post("/createList", createList);
route.get("/list", list);
route.delete("/deletewist/:id", deleteWist);
module.exports = route;
