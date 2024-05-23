const express = require("express");
const {
  createContact,
  getContact,
} = require("../controller/contactController");
const Route = express.Router();
Route.post("/create", createContact);
Route.get("/getAllData", getContact);

module.exports = Route;
