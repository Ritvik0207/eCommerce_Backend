const addressModel = require('../models/addressModel');

const createAddress = async (info) => {
  const address = await addressModel.create({
    user_id: info.user_id,
    deliveredToWhom: info.deliveredToWhom,
    address: info.address,
    district: info.district,
    state: info.state,
    pincode: info.pincode,
    phone: info?.phone || null,
    street: info.street,
    landmark: info.landmark,
  });

  return {
    success: true,
    message: 'Address succesfully created',
    ...address._doc,
  };
};

const getAddress = async () => {
  const address = await addressModel.find();
  return {
    success: true,
    message: 'Address succesfully fetched',
    address,
  };
};

module.exports = {
  createAddress,
  getAddress,
};
