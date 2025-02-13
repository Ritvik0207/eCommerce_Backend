// payment controller
const { default: mongoose } = require('mongoose');
const { ADMIN_ROLES, PAYMENT_STATUS } = require('../constants/constants');
const Admin = require('../models/adminModel');
const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');
const { generateTransactionId } = require('../utils/generateTxnId');

// get all payments
const getPayments = async (req, res) => {
  // determine which admin is logged in
  const admin = req?.admin;
  if (!admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // if super admin is logged in, get all payments
  if (admin?.role !== ADMIN_ROLES.SUPER_ADMIN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // get all payments
  const payments = await Payment.find().populate('order');
  res.status(200).json({
    status: 'success',
    data: payments,
  });
};

// get payment by id
const getPaymentById = async (req, res) => {
  const payment = await Payment.findById(req?.params?.id).populate('order');
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }
  res.status(200).json({
    status: 'success',
    data: payment,
  });
};

// update payment
const updatePayment = async (req, res) => {
  if (req?.admin?.role !== ADMIN_ROLES.SUPER_ADMIN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const payment = await Payment.findByIdAndUpdate(req?.params?.id, req?.body, {
    new: true,
  }).populate('order');

  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  // Update corresponding order payment details
  if (payment.order) {
    await Order.findByIdAndUpdate(payment.order, {
      payment: {
        transactionId: payment.transactionId,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        timestamp: payment.updatedAt,
      },
      payment_type: payment.paymentMethod,
      payment_details: payment._id,
    });
  }

  res.status(200).json({
    status: 'success',
    data: payment,
  });
};

// delete payment
const deletePayment = async (req, res) => {
  if (req?.admin?.role !== ADMIN_ROLES.SUPER_ADMIN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!mongoose.Types.ObjectId.isValid(req?.params?.id)) {
    return res.status(400).json({ message: 'Invalid payment ID' });
  }

  const payment = await Payment.findById(req?.params?.id);
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  // Remove payment reference from order
  if (payment.order) {
    await Order.findByIdAndUpdate(payment.order, {
      payment: {
        status: PAYMENT_STATUS.PENDING,
      },
      payment_details: null,
      payment_type: null, // Also clear payment_type when removing payment
    });
  }

  try {
    await Payment.findByIdAndDelete(req?.params?.id);
    res.status(200).json({
      status: 'success',
      message: 'Payment deleted successfully',
    });
  } catch (error) {
    // Handle potential MongoDB index conflicts
    if (error.code === 86) {
      return res.status(500).json({
        status: 'error',
        message: 'Database error: Index conflict while deleting payment',
      });
    }
    throw error;
  }
};

// Migrate payments from orders to payment collection
const migrateOrderPayments = async (req, res) => {
  if (req?.admin?.role !== ADMIN_ROLES.SUPER_ADMIN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const orders = await Order.find();

  const migratedPayments = [];

  for (const order of orders) {
    if (!order.payment_details) {
      const txnId = generateTransactionId(order._id);
      const paymentStatus =
        order.payment.status === 'Paid' || order.payment.status === 'Success'
          ? PAYMENT_STATUS.COMPLETED
          : order.payment.status;

      const payment = await Payment.create({
        order: order._id,
        userId: order.user_id,
        transactionId: order.payment.transactionId || txnId,
        amount: order.amount || order.payment.amount,
        currency: order.payment.currency || 'INR',
        paymentMethod: order.payment_type,
        status: paymentStatus,
        paymentGateway: 'migrated',
        gatewayResponse: {},
        metadata: {
          migratedAt: new Date(),
          originalOrder: order._id,
        },
      });

      // Update order with payment reference
      await Order.findByIdAndUpdate(order._id, {
        payment_details: payment._id,
      });

      migratedPayments.push(payment);
    }
  }

  res.status(200).json({
    status: 'success',
    message: `Successfully migrated ${migratedPayments.length} payments`,
    data: migratedPayments,
  });
};

// migrate orderId to order
const migrateOrderIdToOrder = async (req, res) => {
  if (req?.admin?.role !== ADMIN_ROLES.SUPER_ADMIN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const payments = await Payment.updateMany({ orderId: { $exists: true } }, [
    {
      $set: {
        order: '$orderId',
      },
    },
    {
      $project: {
        orderId: 0, // This removes the orderId field
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    message: `Successfully migrated ${payments.modifiedCount} payments`,
  });
};

module.exports = {
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  migrateOrderPayments,
  migrateOrderIdToOrder,
};
