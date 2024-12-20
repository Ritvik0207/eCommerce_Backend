const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["Super Admin", "Shop Seller Site Admin"],
      required: true,
    },
    personalName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    shopName: {
      type: String,
    },
    shopAddress: {
      type: String,
    },
    shopLogo: {
      type: String,
    },
    businessRegistrationNumber: {
      type: String,
    },
    bankDetails: {
      bankName: { type: String, required: true },
      accountHolderName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
    },
    taxInfo: {
      gstin: {
        type: String,
        required: function () {
          return this.role === "Shop Seller Site Admin";
        },
      },
      taxId: {
        type: String,
      },
    },
    isVerified: { type: Boolean, default: false },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin", adminSchema);
