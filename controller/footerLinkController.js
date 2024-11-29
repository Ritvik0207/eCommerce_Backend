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

const updateFooterlink = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const footerlink = await footerLinkModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!footerlink) {
      return res.status(404).json({
        success: false,
        message: "Footerlink not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Footerlink updated successfully",
      footerlink: footerlink,
    });
  } catch (error) {
    console.error("Error updating footerlink:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating footerlink.",
    });
  }
};

const deleteFooterlink = async (req, res) => {
  try {
    const { id } = req.params;
    const footerlinkToDelete = await footerLinkModel.findById(id);
    if (!footerlinkToDelete) {
      return res.status(404).json({
        success: false,
        message: "Footerlink not found",
      });
    }

    await footerSubHeadingModel.findByIdAndUpdate(
      footerlinkToDelete.footerSubHeading,
      {
        $pull: { footerlink: id },
      }
    );

    await footerLinkModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Footerlink deleted successfully",
      footerlinkToDelete,
    });
  } catch (error) {
    console.error("Error deleting footerlink:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting footerlink.",
    });
  }
};

module.exports = {
  createFooterLink,
  getFooterlink,
  updateFooterlink,
  deleteFooterlink,
};
