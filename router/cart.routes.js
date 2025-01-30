const express = require('express');
const {
  cartList,
  getCartByUserId,
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
  clearCart,
} = require('../controller/cartController');
const authenticateCustomer = require('../middlewares/authenticateCustomer');

const route = express.Router();

route.post('/add', authenticateCustomer, addToCart);
route.put('/update', authenticateCustomer, updateCart);
route.get('/getCart', authenticateCustomer, getCart);
route.delete(
  '/remove/:productId/:variantId',
  authenticateCustomer,
  removeFromCart
);
route.delete('/clear', authenticateCustomer, clearCart);

route.get('/', cartList);
route.get('/user/:id', getCartByUserId);

module.exports = route;
