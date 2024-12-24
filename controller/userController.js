// @ts-nocheck
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const OTP = require('../models/otpModel.js');

const User = require('../models/user.js');
const { createAddress } = require('../utils/address.utils.js');
const { default: mongoose } = require('mongoose');
const userModel = require('../models/user.js');
const asyncHandler = require('express-async-handler');
const validator = require('validator');
const Address = require('../models/addressModel.js');
// bcrypt.genSalt(10,(err,salt)=>{
//   if (!err){
//     bcrypt.hash(user.password, s  async(err,hpass)=>{

//     })
//   }
// })
// const createUser = async (req, res) => {
//   try {
//     const { role, userName, email, password } = req.body;
//     const userExist = await User.findOne({ email });
//     console.log(userExist);

//     if (userExist) return res.json("User Exist");
//     const genSalt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, genSalt);
//     const data = {
//       role,
//       userName,
//       email,
//       password: hash,
//     };
//     const createData = await User.create(data);
//     console.log(createData);
//     return res.status(201).json({ success: true, data: createData });
//   } catch (err) {
//     return res.status(500).json({ success: err.message, stack: err.stack });
//   }
// };

// Function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
}

// Function to send OTP via email
async function sendOTP(email, otp) {
  // Create a Nodemailer transporter
  await OTP.create({ email, otp });
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lanthoibaecommerce@gmail.com', // Your Gmail email address
      pass: 'fwxo jnvx wkvu lzev', // Your Gmail password
    },
  });

  // Send OTP email
  const info = await transporter.sendMail({
    from: '"Lanthoiba" <lanthoibaecommerce@gmail.com>', // Sender address
    to: email, // List of receivers
    subject: 'OTP for Account Verification',
    text: `Your OTP for account verification is: ${otp}`,
  });

  console.log('Message sent: %s', info.messageId);
}

// const createUser = async (req, res) => {
//   try {
//     const { role, userName, email, password } = req.body;
//     const userExist = await User.findOne({ email });

//     if (userExist) return res.json("User Exist");

//     // const otp = generateOTP(); // Generate OTP
//     // // Store the OTP and its expiration time in your database

//     // // Send OTP to the user's email
//     // await sendOTP(email, otp);

//     const genSalt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, genSalt);
//     const data = {
//       role,
//       userName,
//       email,
//       password: hash,
//     };
//     const createData = await User.create(data);

//     return res
//       .status(201)
//       .json({ success: true, message: "Create a new User", data: createData });
//   } catch (err) {
//     return res
//       .status(500)
//       .json({ success: false, message: err.message, stack: err.stack });
//   }
// };

const createUser = asyncHandler(async (req, res) => {
  const { userName, email, password, phone } = req.body;

  // LIST ALL COMMON STATUS CODE IN EXPRESS
  // 200: OK
  // 201: Created
  // 204: No Content
  // 400: Bad Request
  // 401: Unauthorized
  // 403: Forbidden
  // 404: Not Found
  // 500: Internal Server Error

  // validate all the fields
  if (!userName || !email || !password || !phone) {
    res.statusCode = 400;
    throw new Error('All fields are required');
  }

  // validate email
  if (!validator.isEmail(email)) {
    res.statusCode = 400;
    throw new Error('Invalid email');
  }

  // password validation
  if (!validator.isStrongPassword(password)) {
    res.statusCode = 400;
    throw new Error(
      'Password must be at least 8 characters long, 1 uppercase, 1 lowercase, 1 number, 1 special character'
    );
  }

  // check if phone number is valid
  if (!validator.isMobilePhone(phone)) {
    res.statusCode = 400;
    throw new Error('Invalid phone number');
  }

  // check if user already exists
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.statusCode = 400;
    throw new Error('User already exists');
  }

  const genSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, genSalt);
  const userData = {
    userName,
    email,
    password: hashedPassword,
    phone,
  };

  const newUser = await User.create(userData);
  const { password: _, ...userWithoutPassword } = newUser.toObject();

  return res.status(201).json({
    success: true,
    message: 'User created successfully',
    user: userWithoutPassword,
    // address: addressResponse || null,
  });
});

const addNewAddress = asyncHandler(async (req, res) => {
  const { address, setDefault } = req.body;

  // validate address fields
  if (
    !address.address ||
    !address.district ||
    !address.state ||
    !address.pincode ||
    !address.landmark ||
    !address.street
  ) {
    res.statusCode = 400;
    throw new Error('All address fields are required');
  }

  if (!mongoose.isValidObjectId(req.user._id)) {
    res.statusCode = 400;
    throw new Error('Invalid user id');
  }

  const existingUser = await User.findById(req.user._id);
  if (!existingUser) {
    res.statusCode = 400;
    throw new Error('User does not exist');
  }

  const addressResponse = await createAddress({
    user_id: req.user._id,
    deliveredToWhom: address.deliveredToWhom || req.user.userName,
    ...address,
  });

  existingUser.address.push(addressResponse._id);
  if (setDefault) {
    existingUser.defaultAddress = addressResponse._id;
  }
  await existingUser.save();
  const { password: _, ...userWithoutPassword } = existingUser.toObject();
  return res.status(201).json({ success: true, data: userWithoutPassword });
});

// const getAddressByUserId = async (req, res) => {
//   try {
//     const { _id } = req.body;
//     const addressResponse = await User.findById(
//       new mongoose.Types.ObjectId(_id)
//     ).populate("address");
//     if (!addressResponse) {
//       return res.status(400).json({ message: "User does not exist" });
//     }
//     return res.status(201).json({ success: true, data: addressResponse });
//   } catch (err) {
//     return res.status(500).json({ success: err.message, stack: err.stack });
//   }
// };

const getAddressByUserId = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.user._id)) {
    res.statusCode = 400;
    throw new Error('Invalid user id');
  }

  const user = await User.findById(req.user._id)
    .populate('address')
    .populate('defaultAddress');

  if (!user) {
    res.statusCode = 400;
    throw new Error('User does not exist');
  }

  return res.status(200).json({
    success: true,
    data: {
      addresses: user.address,
      defaultAddress: user.defaultAddress,
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.statusCode = 400;
    throw new Error('All fields are required');
  }

  // validating email
  if (!validator.isEmail(email)) {
    res.statusCode = 400;
    throw new Error('Invalid email');
  }

  // validating password
  if (!validator.isStrongPassword(password)) {
    res.statusCode = 400;
    throw new Error(
      'Password must be at least 8 characters long, 1 uppercase, 1 lowercase, 1 number, 1 special character'
    );
  }

  const userExist = await User.findOne({ email });
  if (!userExist) {
    res.statusCode = 400;
    throw new Error('Email does not register');
  }

  const isPasswordCorrect = await bcrypt.compare(password, userExist.password);
  if (!isPasswordCorrect) {
    res.statusCode = 400;
    throw new Error('Password is incorrect');
  }
  const { password: _, ...userWithoutPassword } = userExist.toObject();

  const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    httpOnly: true, // prevent client side js from accessing the cookie and prevent XSS attacks
    secure: true, // only send cookie over https
    sameSite: 'none', // allow cookie to be sent to different domains
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.json({
    message: 'Login Successful',
    user: userWithoutPassword,
  });
});

const getAllCustomers = asyncHandler(async (req, res) => {
  const data = await User.find();
  console.log(data);
  return res.status(200).json({ success: 'Get all the Data', data: data });
});

//for calculating the number of user
const getTotalUserCount = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    res.status(200).json({
      success: true,
      message: 'Total user count fetched successfully',
      total: totalUsers,
    });
  } catch (err) {
    console.error('Error occurred while fetching total user count:', err);
    res.status(500).json({
      success: false,
      message: 'Error occurred while fetching total user count',
      error: err.message,
    });
  }
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!mongoose.isValidObjectId(productId)) {
    res.statusCode = 400;
    throw new Error('Invalid product id');
  }

  if (quantity <= 0) {
    res.statusCode = 400;
    throw new Error('Quantity must be greater than 0');
  }

  if (!mongoose.isValidObjectId(req.user._id)) {
    res.statusCode = 400;
    throw new Error('Invalid user id');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.statusCode = 400;
    throw new Error('User not found');
  }

  const cartItem = user.cart.find(
    (item) => item.product.toString() === productId
  );

  if (cartItem) {
    // Update quantity if product exists in the cart
    cartItem.quantity = quantity;
  } else {
    // Add a new product to the cart
    user.cart.push({ product: productId, quantity });
  }

  await user.save();
  return res.status(200).json({ success: true, message: 'Cart updated' });
});

const getCart = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.user._id)) {
    res.statusCode = 400;
    throw new Error('Invalid user id');
  }

  const user = await User.findById(req.user._id).populate('cart.product');
  if (!user) {
    res.statusCode = 400;
    throw new Error('User not found');
  }

  return res.status(200).json({ success: true, cart: user.cart });
});

module.exports = {
  createUser,
  addNewAddress,
  getAddressByUserId,
  getAllCustomers,
  loginUser,
  sendOTP,
  generateOTP,
  getTotalUserCount,
  addToCart,
  getCart,
};
