const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Import your admin model
// const { generateOTP, sendOTP } = require("../utils/otpUtils");
const adminModel = require('../models/adminModel');
const asyncHandler = require('express-async-handler');
const { ADMIN_ROLES } = require('../constants/constants');
const validator = require('validator');
const shopModel = require('../models/shopModel');
const artisanModel = require('../models/artisanModel');
const { default: mongoose } = require('mongoose');

// Only accessible to super admin
const createAdmin = asyncHandler(async (req, res) => {
  if (req.admin.role !== ADMIN_ROLES.SUPER_ADMIN) {
    res.statusCode = 403;
    throw new Error('Forbidden');
  }

  const { role, name, email, password, ...rest } = req.body;

  // Check if all fields are provided
  if (!role || !name || !email || !password) {
    res.statusCode = 400;
    throw new Error('All fields are required');
  }

  // Check if role is valid
  if (!Object.values(ADMIN_ROLES).includes(role)) {
    res.statusCode = 400;
    throw new Error('Invalid role');
  }

  // Check if email is valid
  if (!validator.isEmail(email)) {
    res.statusCode = 400;
    throw new Error('Invalid email');
  }

  // Check if password is strong
  if (!validator.isStrongPassword(password)) {
    res.statusCode = 400;
    throw new Error(
      'Password must be at least 8 characters long, 1 uppercase, 1 lowercase, 1 number, 1 special character'
    );
  }

  // Check if admin already exists
  const adminExist = await adminModel.findOne({ email });
  if (adminExist) {
    res.statusCode = 400;
    throw new Error('Admin already exists');
  }

  // Hash password
  const genSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, genSalt);

  // Create new admin data
  const adminData = {
    name,
    email,
    password: hashedPassword,
    role,
    ...rest,
  };

  // Create admin in the database
  const newAdmin = await adminModel.create(adminData);
  const adminWithoutPassword = await adminModel.findById(newAdmin._id);

  return res.status(201).json({
    success: true,
    message: 'Admin created successfully',
    admin: adminWithoutPassword,
  });
});

const signUpAsSellerAdmin = asyncHandler(async (req, res) => {
  const { email, password, ...rest } = req.body;

  // Prevent seller admin from creating SUPER ADMIN
  if (rest?.role !== ADMIN_ROLES.SELLER_ADMIN) {
    res.statusCode = 400;
    throw new Error('Invalid role');
  }

  if (!email || !password) {
    res.statusCode = 400;
    throw new Error('All fields are required');
  }

  if (!validator.isEmail(email)) {
    res.statusCode = 400;
    throw new Error('Invalid email');
  }

  if (!validator.isStrongPassword(password)) {
    res.statusCode = 400;
    throw new Error(
      'Password must be at least 8 characters long, 1 uppercase, 1 lowercase, 1 number, 1 special character'
    );
  }

  const sellerAdminExist = await adminModel.findOne({ email });
  if (sellerAdminExist) {
    res.statusCode = 400;
    throw new Error('Seller admin already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const sellerAdmin = await adminModel.create({
    email,
    password: hashedPassword,
    role: ADMIN_ROLES.SELLER_ADMIN,
    ...rest,
  });

  const sellerAdminWithoutPassword = await adminModel.findById(sellerAdmin._id);

  return res.status(201).json({
    success: true,
    message: 'You have become a seller admin',
    sellerAdmin: sellerAdminWithoutPassword,
  });
});

// Admin Login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if all fields are provided
  if (!email || !password) {
    res.statusCode = 400;
    throw new Error('All fields are required');
  }

  // Check if email is valid
  if (!validator.isEmail(email)) {
    res.statusCode = 400;
    throw new Error('Invalid email');
  }

  // Check if password is strong
  if (!validator.isStrongPassword(password)) {
    res.statusCode = 400;
    throw new Error(
      'Password must be at least 8 characters long, 1 uppercase, 1 lowercase, 1 number, 1 special character'
    );
  }

  const admin = await adminModel.findOne({ email }).select('+password');
  if (!admin) {
    res.statusCode = 400;
    throw new Error('Admin not found');
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    res.statusCode = 400;
    throw new Error('Incorrect password');
  }

  const adminWithoutPassword = await adminModel.findById(admin._id);

  // Generate JWT token
  const token = jwt.sign(
    adminWithoutPassword.toObject(),
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  // Set cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: 'Login successful',
  });
});

// Get all admins
const getAdmins = asyncHandler(async (req, res) => {
  if (req.admin.role !== ADMIN_ROLES.SUPER_ADMIN) {
    res.statusCode = 403;
    throw new Error('Forbidden');
  }

  const admins = await adminModel.find();
  return res.status(200).json({
    success: true,
    admins,
  });
});

// Function to verify admin email via OTP
const verifyAdminEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate OTP and store it
    const otp = generateOTP();
    await sendOTP(email, otp);

    return res.status(200).json({
      success: true,
      message: 'OTP sent to email',
      otp,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update admin information
const updateAdmin = asyncHandler(async (req, res) => {
  if (!Object.values(ADMIN_ROLES).includes(req.admin.role)) {
    res.statusCode = 401;
    throw new Error('You are not authorized to update this admin');
  }

  const { role: _role, adminId, _id: _adminId, ...updateData } = req.body;

  if (req.admin?.role === ADMIN_ROLES.SHOP_SELLER_SITE_ADMIN) {
    if (_role !== ADMIN_ROLES.SHOP_SELLER_SITE_ADMIN) {
      res.statusCode = 400;
      throw new Error('You are not authorized to update your role');
    }
  }

  if (updateData?.password) {
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(updateData.password, genSalt);
    updateData.password = hashedPassword;
  }

  if (updateData?.shop) {
    if (!mongoose.Types.ObjectId.isValid(updateData.shop)) {
      res.statusCode = 400;
      throw new Error('Invalid shop ID');
    }
    const shop = await shopModel.findById(updateData.shop);
    if (!shop) {
      res.statusCode = 400;
      throw new Error('Shop not found');
    }
    updateData.shop = shop._id;
  }

  if (updateData?.artisan) {
    if (!mongoose.Types.ObjectId.isValid(updateData.artisan)) {
      res.statusCode = 400;
      throw new Error('Invalid artisan ID');
    }
    const artisan = await artisanModel.findById(updateData.artisan);
    if (!artisan) {
      res.statusCode = 400;
      throw new Error('Artisan not found');
    }
    updateData.artisan = artisan._id;
  }

  const dataToUpdate = {
    role: req.admin.role,
    ...updateData,
  };

  if (req.admin.role === ADMIN_ROLES.SUPER_ADMIN && !adminId) {
    res.statusCode = 400;
    throw new Error('Admin ID is required');
  }

  const adminIdToUpdate =
    req.admin.role === ADMIN_ROLES.SUPER_ADMIN ? adminId : req.admin._id;

  // Find and update admin
  const updatedAdmin = await adminModel.findByIdAndUpdate(
    adminIdToUpdate,
    dataToUpdate,
    {
      // Return the updated document instead of the original document
      new: true,
    }
  );

  if (!updatedAdmin) {
    res.statusCode = 404;
    throw new Error('Admin not found');
  }

  return res.status(200).json({
    success: true,
    message: 'Admin updated successfully',
    admin: updatedAdmin,
  });
});

// Delete admin
const deleteAdmin = asyncHandler(async (req, res) => {
  if (req.admin.role !== ADMIN_ROLES.SUPER_ADMIN) {
    res.statusCode = 403;
    throw new Error('Forbidden');
  }

  const { adminId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    res.statusCode = 400;
    throw new Error('Invalid admin ID');
  }

  // Find and delete admin
  const deletedAdmin = await adminModel.findByIdAndDelete(adminId);
  if (!deletedAdmin) {
    res.statusCode = 404;
    throw new Error('Admin not found');
  }

  return res.status(204).json({
    success: true,
    message: 'Admin deleted successfully',
  });
});

// Get total number of admins
const getTotalAdminCount = asyncHandler(async (req, res) => {
  if (req.admin.role !== ADMIN_ROLES.SUPER_ADMIN) {
    res.statusCode = 403;
    throw new Error('Forbidden');
  }

  const totalAdmins = await adminModel.countDocuments();

  return res.status(200).json({
    success: true,
    totalAdmins,
  });
});

// get number of seller admins
const getTotalSellerAdminCount = asyncHandler(async (req, res) => {
  if (req.admin.role !== ADMIN_ROLES.SUPER_ADMIN) {
    res.statusCode = 403;
    throw new Error('Forbidden');
  }

  const totalSellerAdmins = await adminModel.countDocuments({
    role: ADMIN_ROLES.SHOP_SELLER_SITE_ADMIN,
  });

  return res.status(200).json({
    success: true,
    totalSellerAdmins,
  });
});

module.exports = {
  createAdmin,
  loginAdmin,
  getAdmins,
  verifyAdminEmail,
  updateAdmin,
  deleteAdmin,
  getTotalAdminCount,
  signUpAsSellerAdmin,
  getTotalSellerAdminCount,
};
