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

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//       cb(null, true); // Accept the file
//     } else {
//       cb(new Error("Only .png or .jpg files are allowed"), false); // Reject the file
//     }
//   },
// });

// router.post("/addCarousel",upload.any(), createCarousel);
// router.get("/getCarousel", carouselList);

router
  .route("/")
  .post(upload.single("img_id"), createCarousel)
  .get(carouselList);

// router.post("/carousel", upload.single("img"), createCarousel);
// router.get("/carousel-list", carouselList);

module.exports = router;
