const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema(
  {
    subCategoryName: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
  },
  { timestamps: true }
);
const subCategoryModel = mongoose.model("subCategory", subCategorySchema);
module.exports = subCategoryModel;
