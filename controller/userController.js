// @ts-nocheck
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const OTP = require("../models/otpModel.js");

const User = require("../models/user.js");
const { createAddress } = require("../utils/address.utils.js");
const { default: mongoose } = require("mongoose");
const userModel = require("../models/user.js");

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
    service: "gmail",
    auth: {
      user: "lanthoibaecommerce@gmail.com", // Your Gmail email address
      pass: "fwxo jnvx wkvu lzev", // Your Gmail password
    },
  });

  // Send OTP email
  const info = await transporter.sendMail({
    from: '"Lanthoiba" <lanthoibaecommerce@gmail.com>', // Sender address
    to: email, // List of receivers
    subject: "OTP for Account Verification",
    text: `Your OTP for account verification is: ${otp}`,
  });

  console.log("Message sent: %s", info.messageId);
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

const createUser = async (req, res) => {
  try {
    const { userName, email, password, address } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) return res.json("User Exists");

    const genSalt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, genSalt);
    const userData = {
      userName,
      email,
      password: hash,
    };

    const newUser = await User.create(userData);

    let addressResponse;
    if (address) {
      addressResponse = await addressModel.create({
        user_id: newUser._id,
        ...address,
      });

      newUser.address = [addressResponse._id];
      newUser.defaultAddress = addressResponse._id;
      await newUser.save();
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
      address: addressResponse || null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
};

const addNewAddress = async (req, res) => {
  try {
    const { address, _id, setDefault } = req.body;
    console.log(address, _id, setDefault);
    const existingUser = await User.findById(new mongoose.Types.ObjectId(_id));
    if (!existingUser) return res.json("User does not exist");
    const addressResponse = await createAddress({ user_id: _id, ...address });
    if (!addressResponse.success)
      return res.status(400).json({ message: "Error creating address" });
    existingUser.address.push(addressResponse._id);
    if (setDefault) {
      existingUser.defaultAddress = addressResponse._id;
    }
    await existingUser.save();
    return res.status(201).json({ success: true, data: existingUser });
  } catch (err) {
    return res.status(500).json({ success: err.message, stack: err.stack });
  }
};

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

const getAddressByUserId = async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await User.findById(new mongoose.Types.ObjectId(_id))
      .populate("address")
      .populate("defaultAddress");

    if (!user) return res.status(400).json({ message: "User does not exist" });

    return res.status(200).json({
      success: true,
      data: {
        addresses: user.address,
        defaultAddress: user.defaultAddress,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message, stack: err.stack });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) return res.json("Email does not register");

    const compare = await bcrypt.compare(password, userExist.password);
    if (!compare) {
      return res.json("Password is incorrect");
    }
    const token = jwt.sign({ email }, "lanthoiba", {
      expiresIn: "1h",
    });
    return res.json({
      message: "login Successful",
      token: token,
    });
  } catch (err) {
    return res.status(404).json(err);
  }
};

const getUser = async (req, res) => {
  try {
    const data = await User.find();
    console.log(data);
    return res.status(200).json({ success: "Get all the Data", data: data });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};

//for calculating the number of user
const getTotalUserCount = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    res.status(200).json({
      success: true,
      message: "Total user count fetched successfully",
      total: totalUsers,
    });
  } catch (err) {
    console.error("Error occurred while fetching total user count:", err);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching total user count",
      error: err.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (cartItem) {
      // Update quantity if product exists in the cart
      cartItem.quantity += quantity;
    } else {
      // Add a new product to the cart
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Cart updated", cart: user.cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("cart.product");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, cart: user.cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createUser,
  addNewAddress,
  getAddressByUserId,
  getUser,
  loginUser,
  sendOTP,
  generateOTP,
  getTotalUserCount,
  addToCart,
  getCart,
};
