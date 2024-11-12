const aboutusModel = require("../models/aboutusModel");

const createAboutus = async (req, res) => {
  try {
    const { title, subheading, details } = req.body;
    const aboutus = await aboutusModel.create({
      title,
      subheading,
      details,
    });
    res.status(201).json({
      success: true,
      message: "About us succesfully Added",
      aboutus,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAboutus = async (req, res) => {
  try {
    const aboutus = await aboutusModel.find();
    res.status(200).json({
      success: true,
      message: "About us succesfully fetch",
      aboutus,
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
  createAboutus,
  getAboutus,
};
