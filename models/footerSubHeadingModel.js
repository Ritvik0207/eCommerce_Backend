const mongoose = require("mongoose");

const footerSubHeadingSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Footer name is required"],
      unique: true,
    },

    footerlink: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "footerLink",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("footersubheading", footerSubHeadingSchema);
