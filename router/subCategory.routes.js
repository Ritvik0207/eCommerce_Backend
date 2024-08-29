const express = require('express');
const { createSubCategory } = require('../controller/subCategoryController');

const Route =express.Router();
Route.post("/createSubCategory",createSubCategory);
module.exports=Route