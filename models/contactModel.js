const mongoose = require('mongoose');
const { defaultSortPlugin } = require('../utils/mongoosePlugin');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

contactSchema.plugin(defaultSortPlugin);

module.exports = mongoose.model('contacts', contactSchema);
