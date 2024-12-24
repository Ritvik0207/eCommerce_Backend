const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'User ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Order amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
      required: [true, 'Order status is required'],
    },
    payment: {
      transactionId: String,
      status: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending',
      },
      amount: Number,
      currency: {
        type: String,
        default: 'INR',
      },
      timestamp: Date,
    },
    payment_type: {
      type: String,
      enum: [
        'COD',
        'Credit Card',
        'Debit Card',
        'Net Banking',
        'UPI',
        'Wallet',
      ],
      required: [true, 'Payment type is required'],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'productVariants',
          required: true,
        },
        name: {
          type: String,
          required: [true, 'Product name is required'],
          trim: true,
        },
        price: {
          type: Number,
          required: [true, 'Product price is required'],
          min: [0, 'Price cannot be negative'],
        },
        quantity: {
          type: Number,
          required: [true, 'Product quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
      },
    ],
    shipping_address: {
      full_name: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxLength: [100, 'Name cannot exceed 100 characters'],
      },
      address_line1: {
        type: String,
        required: [true, 'Address line 1 is required'],
        trim: true,
      },
      address_line2: {
        type: String,
        trim: true,
      },
      landmark: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },
      pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        trim: true,
        match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode'],
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'],
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
orderSchema.index({ user_id: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });

// Virtual for total items in order
orderSchema.virtual('total_items').get(function () {
  return this.products.reduce((sum, item) => sum + item.quantity, 0);
});

const Order = mongoose.model('order', orderSchema);
module.exports = Order;
