const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.js");

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
  getUser,
  loginUser,
};
