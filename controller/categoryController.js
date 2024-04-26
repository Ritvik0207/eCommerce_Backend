const categoryModel = require("../models/categoryModel");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const categoryExist = await categoryModel.findOne({ name });
    console.log("categoryExist");
    if (categoryExist) return res.json("Category exist");
    const category = await new categoryModel({
      name,
    }).save();
    res.status(201).json({
      success: true,
      message: "Category succesfully Added",
      category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await categoryModel.find();
    res
      .status(200)
      .json({ success: true, message: "Category succesfully fetch", category });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await categoryModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Data Successfully Deleted", data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const name = req.body;
    console.log(name);
    const id = req.params.id;
    const data = await categoryModel.findByIdAndUpdate(id, name, {
      new: true,
    });
    console.log(data);
    res.status(201).json({
      success: true,
      message: "Data updated",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
};
