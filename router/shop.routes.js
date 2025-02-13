const express = require('express');
const {
  createShop,
  updateShop,
  getShopDetails,
  deleteShop,
  getAllProducts,
  getAllShops,
  getShopBySellerId,
} = require('../controller/shopController');

const authenticateAdmin = require('../middlewares/authenticateAdmin');
const { validateObjectId } = require('../middlewares/validateObjectId');
const multer = require('multer');

const upload = multer();
const route = express.Router();

route.post(
  '/create',
  upload.fields([{ name: 'logo' }, { name: 'bannerImage' }]),
  createShop
);
route.get('/getAllShops', getAllShops);
route.put(
  '/update/:id',
  authenticateAdmin,
  validateObjectId,
  upload.fields([{ name: 'logo' }, { name: 'bannerImage' }]),
  updateShop
);

route.get('/:id', authenticateAdmin, validateObjectId, getShopDetails);
route.delete('/delete/:id', authenticateAdmin, validateObjectId, deleteShop);
route.get('/:id/products', authenticateAdmin, validateObjectId, getAllProducts);
route.get('/getShopBySellerId/:id', validateObjectId, getShopBySellerId);

module.exports = route;
