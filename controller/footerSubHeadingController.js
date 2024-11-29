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

const deleteFooterSubHeading = async (req, res) => {
  try {
    const { id } = req.params;

    const footerSubHeading = await footerSubHeadingModel.findById(id);
    if (!footerSubHeading) {
      return res.status(404).json({
        success: false,
        message: "FooterSubHeading not found",
      });
    }

    await footerSubHeadingModel.deleteMany({ footersubheading: id });

    await footerSubHeadingModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "FooterSubHeading and its footerLink successfully deleted",
      footerSubHeading,
    });
  } catch (err) {
    console.error("Error deleting footerSubHeading and its footerLink:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the footerSubHeading",
      error: err.message,
    });
  }
};

const updateFooterSubHeading = async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.body;
    console.log(name);
    const footerSubHeading = await footerSubHeadingModel.findByIdAndUpdate(
      id,
      name,
      {
        new: true,
      }
    );
    console.log(footerSubHeading);
    res.status(201).json({
      success: true,
      message: "FooterSubHeading is updated",
      footerSubHeading,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createFooterSubHeading,
  getFooterSubHeading,
  deleteFooterSubHeading,
  updateFooterSubHeading,
};
