const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const AddressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

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
});

//Export the model
module.exports = mongoose.model("Address", AddressSchema);
