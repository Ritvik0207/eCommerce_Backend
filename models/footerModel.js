const mongoose = require("mongoose");

const footerSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Footer name is required"],
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("footer", footerSchema);
