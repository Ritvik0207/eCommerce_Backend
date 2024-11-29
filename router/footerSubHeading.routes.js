const express = require("express");
const {
  createFooterSubHeading,
  getFooterSubHeading,
  deleteFooterSubHeading,
  updateFooterSubHeading,
} = require("../controller/footerSubHeadingController");
const Route = express.Router();
Route.post("/addfootersub", createFooterSubHeading);
Route.get("/getfootersub", getFooterSubHeading);
Route.delete("/deletefootersub/:id", deleteFooterSubHeading);
Route.put("/updatefootersub/:id", updateFooterSubHeading);
module.exports = Route;
