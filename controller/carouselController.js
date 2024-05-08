const carouselModel = require("../models/carouselModel");
const { uploadFile } = require("../upload/upload");
const createCarousel = async (req, res) => {
  try {
    const info = req.body;
    const { files } = req;
    const fieldname = await uploadFile(files[0]);
    const carousel = await carouselModel.create({
      subtitle: info.subtitle,
      title: info.title,
      title2: info.title2,
      img: fieldname,
    });
    res.status(201).json({
      success: true,
      message: "carousel succesfully created",
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
