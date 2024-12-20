const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); // Import your admin model
// const { generateOTP, sendOTP } = require("../utils/otpUtils");
const adminModel = require("../models/adminModel");

// Function to create a new admin user
const createAdmin = async (req, res) => {
  try {
    const {
      role,
      personalName,
      email,
      password,
      shopDetails,
      bankDetails,
      taxInfo,
    } = req.body;

    // Check if admin already exists
    const adminExist = await adminModel.findOne({ email });
    if (adminExist)
      return res.status(400).json({ message: "Admin already exists" });

    // Hash password
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);

    // Create new admin data
    const adminData = {
      role,
      personalName,
      email,
      password: hashedPassword,
      ...shopDetails, // shopName, shopAddress, shopLogo, businessRegistrationNumber
      bankDetails,
      taxInfo,
    };

    // Create admin in the database
    const newAdmin = await adminModel.create(adminData);
    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: newAdmin,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Incorrect password" });

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id }, "secretKey", {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find();
    return res.status(200).json({
      success: true,
      admins,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Function to verify admin email via OTP
const verifyAdminEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate OTP and store it
    const otp = generateOTP();
    await sendOTP(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
      otp,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update admin information
const updateAdmin = async (req, res) => {
  try {
    const { adminId, updateData } = req.body;

    // Find and update admin
    const updatedAdmin = await adminModel.findByIdAndUpdate(
      adminId,
      updateData,
      {
        new: true,
      }
    );
    if (!updatedAdmin)
      return res.status(404).json({ message: "Admin not found" });

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      admin: updatedAdmin,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    // Find and delete admin
    const deletedAdmin = await adminModel.findByIdAndDelete(adminId);
    if (!deletedAdmin)
      return res.status(404).json({ message: "Admin not found" });

    return res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get total number of admins
const getTotalAdminCount = async (req, res) => {
  try {
    const totalAdmins = await adminModel.countDocuments();
    return res.status(200).json({
      success: true,
      totalAdmins,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  getAdmins,
  verifyAdminEmail,
  updateAdmin,
  deleteAdmin,
  getTotalAdminCount,
};
