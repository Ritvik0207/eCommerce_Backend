const express = require('express');
const {
  cartList,
  getCartByUserId,
  addToCart,
  getCart,
  removeFromCart,
} = require('../controller/cartController');
const authenticateCustomer = require('../middlewares/authenticateCustomer');

const route = express.Router();

route.post('/add', authenticateCustomer, addToCart);
route.get('/getCart', authenticateCustomer, getCart);
route.delete('/remove', authenticateCustomer, removeFromCart);

route.get('/', cartList);
route.get('/user/:id', getCartByUserId);

module.exports = route;
