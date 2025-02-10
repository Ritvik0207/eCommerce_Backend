const mongoose = require('mongoose');
const { ADMIN_ROLES } = require('../constants/constants');
const { defaultSortPlugin } = require('../utils/mongoosePlugin');

const adminSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: Object.values(ADMIN_ROLES),
      required: [true, 'Role is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxLength: [50, 'Name cannot exceed 50 characters'],
    },
    phone: {
      type: Number,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Don't return password by default in queries
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'artisan',
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'shop',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better query performance
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });

adminSchema.plugin(defaultSortPlugin);

const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;
