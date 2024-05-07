// @ts-check
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.js");
const { createAddress } = require("../utils/address.utils.js");
const { default: mongoose } = require("mongoose");

// bcrypt.genSalt(10,(err,salt)=>{
//   if (!err){
//     bcrypt.hash(user.password, s  async(err,hpass)=>{

//     })
//   }
// })
const createUser = async (req, res) => {
  try {
    const { role, userName, email, password } = req.body;
    const userExist = await User.findOne({ email });
    console.log(userExist);

    if (userExist) return res.json("User Exist");
    const genSalt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, genSalt);
    const data = {
      role,
      userName,
      email,
      password: hash,
    };
    const createData = await User.create(data);
    console.log(createData);
    return res.status(201).json({ success: true, data: createData });
  } catch (err) {
    return res.status(500).json({ success: err.message, stack: err.stack });
  }
};

const addNewAddress = async (req, res) => {
  // add new address
  try {
    const { address, _id } = req.body;
    console.log(address, _id);
    const existingUser = await User.findById(new mongoose.Types.ObjectId(_id));
    if (!existingUser) return res.json("User does not exist");
    const addressResponse = await createAddress({ user_id: _id, ...address });
    if (!addressResponse.success)
      return res.status(400).json({ message: "Error creating address" });
    existingUser.address.push(addressResponse._id);
    await existingUser.save();
    return res.status(201).json({ success: true, data: existingUser });
  } catch (err) {
    return res.status(500).json({ success: err.message, stack: err.stack });
  }
};

const getAddressByUserId = async (req, res) => {
  // get address by user id
  try {
    const { _id } = req.body;
    const addressResponse = await User.findById(
      new mongoose.Types.ObjectId(_id)
    ).populate("address");
    if (!addressResponse) {
      return res.status(400).json({ message: "User does not exist" });
    }
    return res.status(201).json({ success: true, data: addressResponse });
  } catch (err) {
    return res.status(500).json({ success: err.message, stack: err.stack });
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
module.exports = {
  createUser,
  addNewAddress,
  getAddressByUserId,
  getUser,
  loginUser,
};
