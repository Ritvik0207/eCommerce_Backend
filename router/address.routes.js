const express = require('express');
const {
  addNewAddress,
  getAddressByUserId,
  deleteAddress,
  updateAddress,
  setDefaultAddress,
} = require('../controller/address.controller');
const authenticateCustomer = require('../middlewares/authenticateCustomer');

const Route = express.Router();

Route.post('/addNewAddress', authenticateCustomer, addNewAddress);
Route.get('/getAddressByUserId', authenticateCustomer, getAddressByUserId);
// delete address by id
Route.delete('/delete/:addressId', authenticateCustomer, deleteAddress);

// update address by id
Route.put('/update/:addressId', authenticateCustomer, updateAddress);

// set default address
Route.patch(
  '/setDefaultAddress/:addressId',
  authenticateCustomer,
  setDefaultAddress
);

module.exports = Route;
