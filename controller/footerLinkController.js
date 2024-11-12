const footerLinkModel = require("../models/footerLinkModel");
const footerSubHeadingModel = require("../models/footerSubHeadingModel");

const createFooterLink = async (req, res) => {
  try {
    const footerlinkData = req.body;
    const newFooterlink = await footerLinkModel.create(footerlinkData);
    const updatedFooterSubHeading = await footerSubHeadingModel
      .findByIdAndUpdate(
        footerlinkData.footerSubHeading,
        { $push: { footerlink: newFooterlink._id } },
        { new: true }
      )
      .populate("footerlink");

    return res.status(201).json({
      success: true,
      message: "Footerlink added successfully to footer sub heading",
      Footerlink: newFooterlink,
      FooterSubHeading: updatedFooterSubHeading,
    });
  } catch (error) {
    console.error("Error adding footerlink to footer sub heading:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while adding footerlink to footer sub heading.",
    });
  }
};

const getFooterlink = async (req, res) => {
  try {
    const { footerSubHeadingId } = req.params;
    const footerlink = await footerLinkModel.find({
      footerSubHeading: footerSubHeadingId,
    });
    res.status(200).json({
      success: true,
      message: "Footerlink succesfully fetch",
      footerLink: footerlink,
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
  createFooterLink,
  getFooterlink,
};
