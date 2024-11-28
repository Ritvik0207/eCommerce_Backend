const addressModel = require("../models/addressModel");

const createAddress = async (req, res) => {
  try {
    const info = req.body;
    const address = await addressModel.create({
      user_id: info.user_id,
      name: info.name,
      address: info.address,
      district: info.district,
      state: info.state,
      pincode: info.pincode,
      phone: info.phone,
      street: info.street,
      landmark: info.landmark,
    });
    res.status(201).json({
      success: true,
      message: "Address succesfully Added",
      address,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAddress = async (req, res) => {
  try {
    const address = await addressModel.find();
    res.status(200).json({
      success: true,
      message: "Address succesfully fetch",
      address,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createAddress,
  getAddress,
};
