const orderModel = require("../models/orderModel");

const createOrder = async (req, res) => {
  try {
    const info = req.body;
    const order = await orderModel.create({
      user_id: info.user_id,
      amount: info.amount,
      status: info.status,
      payment: info.payment,
      payment_type: info.payment_type,
      product: info.product,
      address: info.address,
    });
    res.status(201).json({
      success: true,
      message: "order succesfully created",
      order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getOrder = async (req, res) => {
  try {
    const order = await orderModel.find();
    res.status(200).json({
      success: true,
      message: "order succesfully fetched",
      order,
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
  createOrder,
  getOrder,
};
