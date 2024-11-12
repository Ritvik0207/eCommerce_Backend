const footerSubHeadingModel = require("../models/footerSubHeadingModel");
const createFooterSubHeading = async (req, res) => {
  try {
    const { name } = req.body;

    const footerSubHeadingExist = await footerSubHeadingModel.findOne({
      name,
    });
    if (footerSubHeadingExist) return res.json("Footer SubHeading exist");
    const footerSubHeading = await footerSubHeadingModel.create({
      name,
    });
    res.status(201).json({
      success: true,
      message: "Footer sub heading succesfully Added",
      footerSubHeading,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getFooterSubHeading = async (req, res) => {
  try {
    const footerSubHeading = await footerSubHeadingModel
      .find()
      .populate("footerlink");
    res.status(200).json({
      success: true,
      message: "Footer sub heading succesfully fetch",
      footerSubHeading,
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
  createFooterSubHeading,
  getFooterSubHeading,
};
