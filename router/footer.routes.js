const express = require("express");
const { createFooter, getFooter } = require("../controller/footer.controller");
const Route = express.Router();

Route.post("/addfooter", createFooter);
Route.get("/getfooter", getFooter);

module.exports = Route;
