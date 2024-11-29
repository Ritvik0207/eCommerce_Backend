const express = require("express");
const {
  createFooterLink,
  getFooterlink,
  updateFooterlink,
  deleteFooterlink,
} = require("../controller/footerLinkController");
const Route = express.Router();
Route.post("/addfooterlink", createFooterLink);
Route.get("/:footerSubHeadingId/getfooterlink", getFooterlink);
Route.put("/updatefooterlink/:id", updateFooterlink);
Route.delete("/deletefooterlink/:id", deleteFooterlink);

module.exports = Route;
