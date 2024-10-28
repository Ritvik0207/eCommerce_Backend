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

// const getSubCategoryById = async (req, res) => {
//   const { categoryId } = req.params;
//   try {
//     const subCategory = await subCategoryModel
//       .findById(categoryId)
//       .populate("subcategories")
//       .exec();
//     res.status(200).json(subCategory.subcategories);
//   } catch (error) {
//     res.status(400).json({ error: "Category not found" });
//   }
// };

module.exports = {
  createSubCategory,
  getSubCategory,
  // getSubCategoryById,
};
