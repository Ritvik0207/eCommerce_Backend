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
      // required: true,
    },
    payment: {},
    payment_type: {
      type: String,
      enum: ["COD", "Credit Card", "Debit Card", "Net Banking", "UPI"],
      required: true,
    },

    product: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Reference for dynamic fetch
        name: {
          type: String,
          required: true,
        }, // Embed product name
        price: {
          type: Number,
          required: true,
        }, // Embed price at purchase time
        product_color: {
          type: String,
          // required: true,
        },
        product_size: {
          type: String,
          // required: true,
        },
        product_quantity: {
          type: Number,
          //  required: true
        },
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
      district: {
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
