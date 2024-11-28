const express = require("express");
const {
  createAddress,
  getAddress,
} = require("../controller/address.controller");

const Route = express.Router();

Route.post("/create", createAddress);
Route.get("/get", getAddress);

module.exports = Route;
