const asyncHandler = require('express-async-handler');
const expressAsyncHandler = require('express-async-handler');
const { ADMIN_ROLES, ORDER_STATUS } = require('../constants/constants');
const orderModel = require('../models/orderModel');
const { default: mongoose } = require('mongoose');
const userModel = require('../models/user');

const createOrder = asyncHandler(async (req, res) => {
  const { amount, payment, payment_type, products, shipping_address } =
    req.body;

  if (!amount || !payment_type || !products || !shipping_address) {
    res.statusCode = 400;
    throw new Error('Please provide all the required fields');
  }

  if (!Array.isArray(products) || products.length === 0) {
    res.statusCode = 400;
    throw new Error('Please provide valid products');
  }

  // validate shipping address fields
  const requiredFields = [
    'full_name',
    'address_line1',
    'city',
    'state',
    'pincode',
    'phone',
  ];

  // validate payment fields
  if (payment) {
    const { status, amount: paymentAmount } = payment;

    if (!status || !['Pending', 'Success', 'Failed'].includes(status)) {
      res.statusCode = 400;
      throw new Error('Please provide a valid payment status');
    }

    if (!paymentAmount || paymentAmount !== amount) {
      res.statusCode = 400;
      throw new Error('Payment amount does not match order amount');
    }
  }

  if (amount <= 0) {
    res.statusCode = 400;
    throw new Error('Amount must be greater than zero');
  }

  const missingFields = requiredFields.filter(
    (field) => !shipping_address[field]
  );
  if (missingFields.length > 0) {
    res.statusCode = 400;
    throw new Error(
      `Please provide ${missingFields.join(', ')} in shipping address`
    );
  }
  const user_id = req.user._id;

  const order = await orderModel.create({
    user_id,
    amount,
    payment,
    payment_type,
    products,
    shipping_address,
  });

  res.status(201).json({
    success: true,
    message: 'Order successfully created',
    order,
  });
});
// const getOrder = async (req, res) => {
//   try {
//     const order = await orderModel.find();
//     res.status(200).json({
//       success: true,
//       message: "order succesfully fetched",
//       order,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

const getOrder = asyncHandler(async (req, res) => {
  const orders =
    (await orderModel
      .find({ user_id: req.user._id })
      .sort({ createdAt: -1 })) || [];

  res.status(200).json({
    success: true,
    message: 'Orders fetched successfully',
    orders,
  });
});

const getAllOrders = expressAsyncHandler(async (req, res) => {
  if (ADMIN_ROLES.SUPER_ADMIN !== req?.admin?.role) {
    throw new Error('You are not authorized to access this route');
  }

  const orders = (await orderModel.find()) || [];

  res.status(200).json({
    success: true,
    message: 'Orders succesfully fetched',
    orders,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!id) {
    res.statusCode = 400;
    throw new Error('Invalid order Id');
  }

  const order = await orderModel
    .findById(id)
    .populate('products.product')
    .populate('products.variant');

  if (!order) {
    res.statusCode = 404;
    throw new Error('Order not found');
  }

  if (!order.user_id.equals(req.user._id)) {
    res.statusCode = 401;
    throw new Error('You are not authorized to view this order');
  }

  res.status(200).json({
    success: true,
    message: 'Particular order fetched successfully',
    order,
  });
});

const getAllOrdersForCustomer = expressAsyncHandler(async (req, res) => {
  if (ADMIN_ROLES.SUPER_ADMIN !== req?.admin?.role) {
    res.statusCode = 403;
    throw new Error('You are not authorized to access this route');
  }

  const { customerId } = req.params;

  if (!mongoose.isValidObjectId(customerId)) {
    res.statusCode = 400;
    throw new Error('Invalid customer ID');
  }

  // check if the customer exists
  const customer = await userModel.findById(customerId);
  if (!customer) {
    res.statusCode = 404;
    throw new Error('Customer not found');
  }

  const orders = (await orderModel.find({ user_id: customerId })) || [];

  res.status(200).json({
    success: true,
    message: 'Orders succesfully fetched',
    orders,
  });
});

const updateOrderStatus = expressAsyncHandler(async (req, res) => {
  if (!Object.values(ADMIN_ROLES).includes(req?.admin?.role)) {
    res.statusCode = 403;
    throw new Error('You are not authorized to access this route');
  }

  const { orderId } = req.params;
  const { status } = req.body;

  if (!mongoose.isValidObjectId(orderId)) {
    res.statusCode = 400;
    throw new Error('Invalid order ID');
  }

  if (!status) {
    res.statusCode = 400;
    throw new Error('status is required');
  }

  if (!Object.values(ORDER_STATUS).includes(status)) {
    res.statusCode = 400;
    throw new Error(
      'Invalid status. Please use either Pending, Processing, Shipped, Delivered, or Cancelled'
    );
  }

  const order = await orderModel.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  if (!order) {
    res.statusCode = 404;
    throw new Error('Order not found');
  }

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    order,
  });
});

const deleteAllOrders = expressAsyncHandler(async (req, res) => {
  if (ADMIN_ROLES.SUPER_ADMIN !== req?.admin?.role) {
    res.statusCode = 403;
    throw new Error('You are not authorized to access this route');
  }

  const orders = await orderModel.deleteMany({});

  if (!orders) {
    res.statusCode = 404;
    throw new Error('No orders found');
  }

  res.status(200).json({
    success: true,
    message: 'All orders deleted successfully',
    orders,
  });
});

module.exports = {
  createOrder,
  getOrder,
  getOrderById,
  getAllOrders,
  getAllOrdersForCustomer,
  updateOrderStatus,
  deleteAllOrders,
};
