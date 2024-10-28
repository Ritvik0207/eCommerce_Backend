const mongoose = require("mongoose");

const collectionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Collection name is required"],
      // unique: true,
    },
  },
  { timestamps: true }
);

const collectionModel = mongoose.model("collection", collectionSchema);
module.exports = collectionModel;
