const express = require("express");
const {
  createCarousel,
  carouselList,
  updateCarousel,
  deleteCarousel,
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
router.put("/update/:id", upload.single("img_id"), updateCarousel);
router.delete("/delete/:id", deleteCarousel);

// router.post("/carousel", upload.single("img"), createCarousel);
// router.get("/carousel-list", carouselList);

module.exports = router;
