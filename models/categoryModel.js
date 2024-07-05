const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
  },
  { timestamps: true }
);
const categoryModel = mongoose.model("category", categorySchema);
module.exports = categoryModel;
