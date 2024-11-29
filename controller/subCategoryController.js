const categoryModel = require("../models/categoryModel");
const subCategoryModel = require("../models/subCategoryModel");

const createSubCategory = async (req, res) => {
  try {
    const subCategoryData = req.body;
    const newSubCategory = await subCategoryModel.create(subCategoryData);
    const updatedCategory = await categoryModel
      .findByIdAndUpdate(
        subCategoryData.category,
        { $push: { subCategories: newSubCategory._id } },
        { new: true } // Returns the updated category document
      )
      .populate("subCategories"); // Optional: populate the subCategories

    return res.status(201).json({
      success: true,
      message: "Subcategory added successfully to category",
      subcategory: newSubCategory,
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error adding subcategory to category:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding subcategory to category.",
    });
  }
};

const getSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategory = await subCategoryModel.find({ category: categoryId });
    res.status(200).json({
      success: true,
      message: "SubCategory succesfully fetch",
      subCategory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedSubCategory = await subCategoryModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      subcategory: updatedSubCategory,
    });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating subcategory.",
    });
  }
};

// const deleteSubCategory = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const data = await subCategoryModel.findByIdAndDelete(id);
//     if (!data) {
//       return res.status(404).json({
//         success: false,
//         message: "Subcategory not found",
//       });
//     }
//     res
//       .status(200)
//       .json({ success: true, message: "Data Successfully Deleted", data });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategoryToDelete = await subCategoryModel.findById(id);
    if (!subCategoryToDelete) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    await categoryModel.findByIdAndUpdate(subCategoryToDelete.category, {
      $pull: { subCategories: id },
    });

    await subCategoryModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
      subCategoryToDelete,
    });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting subcategory.",
    });
  }
};

module.exports = {
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
