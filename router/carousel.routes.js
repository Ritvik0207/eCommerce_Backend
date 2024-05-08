const express = require("express");
const {
  createCarousel,
  carouselList,
} = require("../controller/carouselController");

const router = express.Router();
const multer = require("multer");
const upload = multer();

// router.post("/addCarousel",upload.any(), createCarousel);
// router.get("/getCarousel", carouselList);

router.route("/").post(upload.any(), createCarousel).get(carouselList);

module.exports = router;
