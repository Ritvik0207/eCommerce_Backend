const express = require("express");
const {
  createAddress,
  getAddress,
  updateAddress,
  deleteAddress,
} = require("../controller/address.controller");

const Route = express.Router();

Route.post("/create", createAddress);
Route.get("/get", getAddress);
Route.put("/update/:id", updateAddress);
Route.delete("/delete/:id", deleteAddress);

module.exports = Route;
