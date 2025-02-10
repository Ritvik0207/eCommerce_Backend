const mongoose = require('mongoose');
const { defaultSortPlugin } = require('../utils/mongoosePlugin');

const footerLinkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'FooterLink name is required'],
    },
    footerSubHeading: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'footersubheading',
      required: true,
    },
  },
  { timestamps: true }
);

footerLinkSchema.plugin(defaultSortPlugin);

module.exports = mongoose.model('footerLink', footerLinkSchema);
