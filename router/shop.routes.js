const express = require('express');
const { 
    createShop, 
    updateShop, 
    getShopDetails,
    deleteShop,
    getAllProducts
 } = require('../controller/shopController');

const authenticateAdmin = require('../middlewares/authenticateAdmin');
const { validateObjectId } = require('../middlewares/validateObjectId');
const multer = require('multer');

const upload = multer();
const route = express.Router();

route.post('/create', upload.fields([{name: 'logo'}, {name: 'bannerImage'}]), createShop);
route.put('/update/:id', authenticateAdmin, validateObjectId, upload.fields([{name: 'logo'}, {name: 'bannerImage'}]), updateShop);
route.get('/:id', authenticateAdmin, validateObjectId, getShopDetails);
route.delete('/:id', authenticateAdmin, validateObjectId, deleteShop);
route.get('/:id/products', authenticateAdmin, validateObjectId, getAllProducts);

module.exports = route;