const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("contacts", contactSchema);
