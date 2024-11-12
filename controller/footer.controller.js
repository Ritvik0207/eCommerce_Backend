const footerModel = require("../models/footerModel");

const createFooter = async (req, res) => {
  try {
    const { title, description } = req.body;
    const footer = await footerModel.create({
      title,
      description,
    });
    res.status(201).json({
      success: true,
      message: "Footer succesfully Added",
      footer,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getFooter = async (req, res) => {
  try {
    const footer = await footerModel.find();
    res.status(200).json({
      success: true,
      message: "Footer succesfully fetch",
      footer,
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
  createFooter,
  getFooter,
};
