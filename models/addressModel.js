const mongoose = require('mongoose'); // Erase if already required
const { defaultSortPlugin } = require('../utils/mongoosePlugin');

// Declare the Schema of the Mongo model
const AddressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  deliveredToWhom: {
    type: String,
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
    required: [true, 'Pincode is required and should be a number'],
  },
  phone: {
    type: Number,
  },
  street: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

AddressSchema.plugin(defaultSortPlugin);

//Export the model
module.exports = mongoose.model('Address', AddressSchema);
