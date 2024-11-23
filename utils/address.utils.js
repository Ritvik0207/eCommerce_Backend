const addressModel = require("../models/adressModel");

const createAddress = async (info) => {
  try {
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
    return {
      success: true,
      message: "Address succesfully created",
      ...address._doc,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message,
    };
  }
};
const getAddress = async () => {
  try {
    const address = await addressModel.find();
    return {
      success: true,
      message: "Address succesfully fetched",
      address,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message,
    };
  }
};

module.exports = {
  createAddress,
  getAddress,
};
