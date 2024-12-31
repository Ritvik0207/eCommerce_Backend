const express = require('express');

const authenticateCustomer = require('../middlewares/authenticateCustomer');
const {
  toggleWishlist,
  getWishlist,
} = require('../controller/wishlist.controller');
const router = express.Router();

// add to wishlist
router.post('/toggle', authenticateCustomer, toggleWishlist);

// get wishlist
router.get('/get-all', authenticateCustomer, getWishlist);

module.exports = router;
