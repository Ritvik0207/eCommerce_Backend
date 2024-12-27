const express = require('express');

const authenticateCustomer = require('../middlewares/authenticateCustomer');
const {
  addToWishlist,
  getWishlist,
  deleteWishlist,
} = require('../controller/wishlist.controller');
const router = express.Router();

// add to wishlist
router.post('/add', authenticateCustomer, addToWishlist);

// get wishlist
router.get('/get-all', authenticateCustomer, getWishlist);

// delete wishlist
router.delete('/delete/:id', authenticateCustomer, deleteWishlist);

module.exports = router;
