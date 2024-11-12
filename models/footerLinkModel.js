const mongoose = require("mongoose");

const footerLinkSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "FooterLink name is required"],
    },
    footerSubHeading: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "footersubheading",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("footerLink", footerLinkSchema);
