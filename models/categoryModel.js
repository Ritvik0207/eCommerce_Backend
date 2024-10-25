const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      // unique: true,
    },
    // image: {
    //   type: String,
    //   required: true,
    // },
    isProductForKids: {
      type: Boolean,
      default: false,
    },
    gender: {
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

// categorySchema.index(
//   { name: 1, sex: 1, isProductForKids: 1 },
//   { unique: true }
// );

const categoryModel = mongoose.model("category", categorySchema);
module.exports = categoryModel;
