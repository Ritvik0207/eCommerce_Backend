const express = require("express");
const {
  createFooterSubHeading,
  getFooterSubHeading,
} = require("../controller/footerSubHeadingController");
const Route = express.Router();
Route.post("/addfootersub", createFooterSubHeading);
Route.get("/getfootersub", getFooterSubHeading);
module.exports = Route;
