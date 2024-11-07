const express = require("express");
const Route = express.Router();
const {
  writeComment,
  getCommentRating,
  updateRating,
} = require("../controller/commentRatingController");
// const multer = require("multer");
// const upload = multer();
Route.post("/comment", writeComment);
// Route.post("/comment", upload.array("image_id"), writeComment);
Route.get("/comment/product/:productId", getCommentRating);
Route.put("/comment/:commentId/rate", updateRating);

module.exports = Route;
