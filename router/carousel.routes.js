const express = require("express");
const {
  createCarousel,
  carouselList,
} = require("../controller/carouselController");

const router = express.Router();
const multer = require("multer");
// const upload = multer();
// const storage = multer.memoryStorage();
const upload = multer({ storage: multer.memoryStorage() });

router
  .route("/")
  .post(upload.single("img_id"), createCarousel)
  .get(carouselList);

// router.post("/carousel", upload.single("img"), createCarousel);
// router.get("/carousel-list", carouselList);

module.exports = router;
