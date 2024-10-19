const categoryModel = require("../models/categoryModel");
const subCategoryModel = require("../models/subCategoryModel");

const createSubCategory = async (req, res) => {
  try {
    const subCategoryData = req.body;

    // TODO: validate the subCategory data

    // 1. Create the new subcategory
    const newSubCategory = await SubCategory.create(subCategoryData);

    // 2. Find the category by ID and update its subCategories array
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

module.exports = {
  createSubCategory,
  getSubCategory,
};
