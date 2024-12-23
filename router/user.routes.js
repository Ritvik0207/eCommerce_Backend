const express = require('express');
const OTP = require('../models/otpModel');
const {
  createUser,
  loginUser,
  addNewAddress,
  getAddressByUserId,
  sendOTP,
  generateOTP,
  getTotalUserCount,
  addToCart,
  getCart,
  getAllCustomers,
} = require('../controller/userController');
const authenticateCustomer = require('../middlewares/authenticateCustomer');

const route = express.Router();

route.post('/register', createUser); //http:localhost:3000/user/register
route.post('/addNewAddress', authenticateCustomer, addNewAddress);
route.get('/getAddressByUserId', authenticateCustomer, getAddressByUserId); //http:localhost:3000/user/create
// admin get all customers
route.get('/getAllCustomers', getAllCustomers);
route.post('/login', loginUser);
// Admin get total users
route.get('/totalUsers', getTotalUserCount);
route.post('/cart/add', authenticateCustomer, addToCart);
route.get('/getCart', authenticateCustomer, getCart);

//otp
route.post('/sendotp', async (req, res) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    const otp = generateOTP();
    await sendOTP(email, otp);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}); //http:localhost:3000/

route.post('/verifyotp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const data = await OTP.findOne({ email, otp });
    if (data) {
      res
        .status(200)
        .json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
module.exports = route;
