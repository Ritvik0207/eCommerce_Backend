const mongoose = require('mongoose');
const {
  PAYMENT_TYPE,
  PAYMENT_STATUS,
  REFUND_STATUS,
} = require('../constants/constants');
const { defaultSortPlugin } = require('../utils/mongoosePlugin');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'order',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: Object.values(PAYMENT_TYPE),
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(PAYMENT_STATUS),
      default: 'pending',
    },
    paymentGateway: {
      type: String,
      required: true,
    },
    gatewayResponse: {
      type: Object,
    },
    refundDetails: {
      refundId: String,
      amount: Number,
      reason: String,
      status: {
        type: String,
        enum: Object.values(REFUND_STATUS),
      },
      refundedAt: Date,
    },
    metadata: {
      type: Object,
    },
    errorMessage: String,
    errorCode: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
paymentSchema.index({ order: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: 1 });

paymentSchema.plugin(defaultSortPlugin);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
