const express = require("express");
const {
  createFooter,
  getFooter,
  updateFooter,
  deleteFooter,
} = require("../controller/footer.controller");
const Route = express.Router();

Route.post("/addfooter", createFooter);
Route.get("/getfooter", getFooter);
Route.put("/update/:id", updateFooter);
Route.delete("/delete/:id", deleteFooter);
module.exports = Route;
