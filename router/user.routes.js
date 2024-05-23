const express = require("express");
const OTP = require("../models/otpModel");
const {
  createUser,
  getUser,
  loginUser,
  addNewAddress,
  getAddressByUserId,
  sendOTP,
  generateOTP,
} = require("../controller/userController");

const route = express.Router();

route.post("/register", createUser); //http:localhost:3000/user/create
route.post("/addNewAddress", addNewAddress);
route.post("/getAddressByUserId", getAddressByUserId); //http:localhost:3000/user/create
route.get("/data", getUser);
route.post("/login", loginUser);

//otp
route.post("/sendotp", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  const otp = generateOTP();
  await sendOTP(email, otp);
  res.status(200).json({ success: true });
}); //http:localhost:3000/

route.post("/verifyotp", async (req, res) => {
  const { email, otp } = req.body;
  console.log(email, otp);
  const data = await OTP.findOne({ email: email, otp: otp });
  if (data) {
    res.status(200).json({ success: true });
  } else {
    res.status(200).json({ success: false });
  }
});
module.exports = route;
