const mongoose = require('mongoose');
const { defaultSortPlugin } = require('../utils/mongoosePlugin');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

paymentSchema.plugin(defaultSortPlugin);
module.exports = mongoose.model('payments', userSchema);
