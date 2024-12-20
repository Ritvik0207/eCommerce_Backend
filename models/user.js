const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Name is compulsory to fill up"],
    },
    email: {
      type: String,
      required: [true, "Email is compulsory to fill up"],
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is compulsory to fill up"],
    },
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1, // Default to 1 if quantity isn't provided
        },
      },
    ],
    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
