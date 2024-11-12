const express = require("express");
const {
  createFooterLink,
  getFooterlink,
} = require("../controller/footerLinkController");
const Route = express.Router();
Route.post("/addfooterlink", createFooterLink);
Route.get("/:footerSubHeadingId/getfooterlink", getFooterlink);

module.exports = Route;
