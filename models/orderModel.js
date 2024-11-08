const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Canceled", "Delivered"],
      required: true,
    },
    payment: {},
    payment_type: {
      type: String,
      enum: ["COD", "Credit Card", "Debit Card", "Net Banking", "UPI"],
      required: true,
    },

    product: [
      {
        product_color: {
          type: String,
          required: true,
        },
        product_size: {
          type: String,
          required: true,
        },
        product_type: {
          type: String,
          required: true,
        },
        product_quantity: { type: Number, required: true },
      },
    ],
    address: {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      landmark: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
