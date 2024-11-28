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
const updateCarousel = async (req, res) => {
  try {
    const { id } = req.params; // Carousel ID from URL
    const info = req.body;
    const fileObject = req.file; // single file from req.file if a new image is uploaded

    // Find the carousel to be updated
    const carousel = await carouselModel.findById(id);
    if (!carousel) {
      return res.status(404).json({
        success: false,
        message: "Carousel not found",
      });
    }

    let updatedFields = {
      subtitle: info.subtitle || carousel.subtitle,
      title: info.title || carousel.title,
      title2: info.title2 || carousel.title2,
    };

    // If a new file is provided, upload it and replace the image ID
    if (fileObject) {
      const fieldname = await uploadFile(fileObject);
      updatedFields.img_id = fieldname;
    }

    const updatedCarousel = await carouselModel.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true, // Return the updated document
      }
    );

    res.status(200).json({
      success: true,
      message: "Carousel successfully updated",
      carousel: updatedCarousel,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const deleteCarousel = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCarousel = await carouselModel.findByIdAndDelete(id);

    if (!deletedCarousel) {
      return res.status(404).json({
        success: false,
        message: "Carousel not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Carousel successfully deleted",
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
  updateCarousel,
  deleteCarousel,
};
