const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    isProductForKids: {
      type: Boolean,
      default: false,
    },
    sex: {
      type: String,
      enum: ["Male", "Female", "Neutral"],
      required: true,
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
      },
    ],
  },
  { timestamps: true }
);
const categoryModel = mongoose.model("category", categorySchema);
module.exports = categoryModel;
