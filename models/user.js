const mongoose = require('mongoose');

// Using 'new' keyword creates a new instance/object of mongoose.Schema
// Without 'new' keyword, mongoose.Schema would be treated as a function call
// 'new' ensures we get a fresh Schema instance with its prototype chain
// Without 'new', we wouldn't get proper inheritance and instance methods
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, 'Name is compulsory to fill up'],
    },
    email: {
      type: String,
      required: [true, 'Email is compulsory to fill up'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is compulsory to fill up'],
    },
    phone: {
      type: Number,
      required: [true, 'Phone is compulsory to fill up'],
      unique: true,
    },
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
      },
    ],
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
        },
        quantity: {
          type: Number,
          default: 1, // Default to 1 if quantity isn't provided
        },
      },
    ],
    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
