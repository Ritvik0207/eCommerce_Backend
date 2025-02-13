const express = require('express');
const asyncHandler = require('express-async-handler');
// const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });
const {
  createCategory,
  // getCategory,
  deleteCategory,
  updateCategory,
  getCategories,
  getTotalCategoryCount,
} = require('../controller/categoryController');
const categoryModel = require('../models/categoryModel');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const { getCategoryById } = require('../controller/getCategories.controller');
const { validateObjectId } = require('../middlewares/validateObjectId');
// const getCategories = require("../controller/getCategories.controller");
const route = express.Router();

//category router
route.get('/get-all', getCategories);
route.post('/create', authenticateAdmin, createCategory);
route.delete('/delete/:categoryId', authenticateAdmin, deleteCategory);
route.put('/update/:categoryId', authenticateAdmin, updateCategory);
route.get('/categoryCount', getTotalCategoryCount);
route.get('/get/:id', validateObjectId, getCategoryById);

module.exports = route;
