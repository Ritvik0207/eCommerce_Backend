const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const multer = require("multer");
const upload = multer();
const router = require("express").Router();
router.post("/", upload.single("test_img"), (req, res) => {
  //   cloudinary.v2.uploader
  //     .upload("/home/my_image.jpg")
  //     .then((result) => console.log(result));
  console.log(req.file);
});

module.exports = router;
