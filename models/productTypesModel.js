const mongoose = require('mongoose');
const { defaultSortPlugin } = require('../utils/mongoosePlugin');

const productTypesSchema = new mongoose.Schema(
  {
    types: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

productTypesSchema.plugin(defaultSortPlugin);

module.exports = mongoose.model('productTypes', productTypesSchema);
