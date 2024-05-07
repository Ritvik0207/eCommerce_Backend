const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  role: {
    type: String,
    required: [true, "Role is compulsory to fill up"],
  },
  userName: {
    type: String,
    required: [true, "Name is compulsory to fill up"],
  },
  email: {
    type: String,
    required: [true, "email is compulsory to fill up"],
  },
  password: {
    type: String,
    required: [true, "Password is compulsory to fill up"],
  },
  address: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      default_selected: Boolean,
      required: false,
    },
  ],
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
