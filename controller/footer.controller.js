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

// Update Footer
const updateFooter = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedFooter = await footerModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedFooter) {
      return res.status(404).json({
        success: false,
        message: "Footer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Footer successfully updated",
      footer: updatedFooter,
    });
  } catch (err) {
    console.error("Error in updateFooter:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Footer
const deleteFooter = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFooter = await footerModel.findByIdAndDelete(id);

    if (!deletedFooter) {
      return res.status(404).json({
        success: false,
        message: "Footer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Footer successfully deleted",
      footer: deletedFooter,
    });
  } catch (err) {
    console.error("Error in deleteFooter:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createFooter,
  getFooter,
  updateFooter,
  deleteFooter,
};
