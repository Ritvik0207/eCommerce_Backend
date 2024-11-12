const express = require("express");
const {
  createAboutus,
  getAboutus,
} = require("../controller/aboutus.controller");
const Route = express.Router();

Route.post("/addaboutus", createAboutus);
Route.get("/getaboutus", getAboutus);

module.exports = Route;
