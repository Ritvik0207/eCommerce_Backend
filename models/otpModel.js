const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define OTP schema
const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "5m", // TTL (time to live) for the OTP, e.g., 5 minutes
  },
});

// Create OTP model
const OTPmodel = mongoose.model("OTP", otpSchema);

module.exports = OTPmodel;
