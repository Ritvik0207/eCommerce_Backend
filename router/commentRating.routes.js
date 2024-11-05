const express = require("express");
const Route = express.Router();
const {
  writeComment,
  getCommentRating,
  updateRating,
} = require("../controller/commentRatingController");

Route.post("/comment", writeComment);
Route.get("/comment/product/:productId", getCommentRating);
Route.put("/comment/:commentId/rate", updateRating);

module.exports = Route;
