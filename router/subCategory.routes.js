const express = require('express');
const {
  createSubCategory,
  getSubCategoryByCategoryId,
  getSubCategoryBySubCategoryId,
  updateSubCategory,
  deleteSubCategory,
} = require('../controller/subCategoryController');

const authenticateAdmin = require('../middlewares/authenticateAdmin');
const { validateObjectId } = require('../middlewares/validateObjectId');

const route = express.Router();
route.post('/create', authenticateAdmin, createSubCategory);
route.get('/category/:categoryId', getSubCategoryByCategoryId);
route.put(
  '/update/:id',
  authenticateAdmin,
  validateObjectId,
  updateSubCategory
);
route.delete(
  '/delete/:id',
  authenticateAdmin,
  validateObjectId,
  deleteSubCategory
);
route.get('/subCategoryId/:subCategoryId', getSubCategoryBySubCategoryId);

module.exports = route;
