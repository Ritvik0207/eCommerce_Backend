const subCategoryModel = require("../models/subCategoryModel");

const createSubCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const subCategoryExist = await subCategoryModel.findOne({ name });
    console.log("subCategoryExist");
    if (subCategoryExist) return res.json("subCategory exist");
    const subCategory = await new subCategoryModel({
      name,
    }).save();
    res.status(201).json({
      success: true,
      message: "SubCategory succesfully Added",
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
};
