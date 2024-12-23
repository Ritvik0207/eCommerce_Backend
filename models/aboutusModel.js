const mongoose = require('mongoose');

const aboutusSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Collection name is required'],
    },
    subheading: {
      type: String,
      // required: true,
    },
    details: {
      type: String,
      // required: true,
    },
    footerlink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'footerLink',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('aboutus', aboutusSchema);
