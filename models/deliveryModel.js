const mongoose = require('mongoose');
const { defaultSortPlugin } = require('../utils/mongoosePlugin');

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    status: {
      type: String,
      enum: [
        'ordered',
        'processing',
        'shipped',
        'out for delivery',
        'delivered',
        'canceled',
      ],
      default: 'ordered',
    },
    estimatedDeliveryTime: { type: Date },
    trackingUpdates: [
      {
        location: String,
        status: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

deliverySchema.plugin(defaultSortPlugin);

module.exports = mongoose.model('delivery', deliverySchema);
