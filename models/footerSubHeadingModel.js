const mongoose = require('mongoose');
const { defaultSortPlugin } = require('../utils/mongoosePlugin');

const footerSubHeadingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Footer name is required'],
      unique: true,
    },

    footerlink: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'footerLink',
      },
    ],
  },
  { timestamps: true }
);

footerSubHeadingSchema.plugin(defaultSortPlugin);

module.exports = mongoose.model('footersubheading', footerSubHeadingSchema);
