const carouselModel = require("../models/carouselModel");
const { uploadFile } = require("../upload/upload");
const createCarousel = async (req, res) => {
  try {
    // console.log("Request Headers:", req.headers);
    // console.log("Request Body:", req.body);
    // console.log("File Object:", req.file);
    // console.log(req);

    const info = req.body;
    const fileObject = req.file; // single file from req.file

    if (!fileObject) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const fieldname = await uploadFile(fileObject);

    const carousel = await carouselModel.create({
      subtitle: info.subtitle,
      title: info.title,
      title2: info.title2,
      img_id: fieldname,
    });

    res.status(201).json({
      success: true,
      message: "Carousel successfully created",
      carousel,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const carouselList = async (req, res) => {
  try {
    const list = await carouselModel.find();
    res.status(201).json({
      success: true,
      message: "carouselList succesfully fetch",
      list,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
module.exports = {
  createCarousel,
  carouselList,
};
