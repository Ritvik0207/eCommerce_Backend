const contactModel = require("../models/contactModel");
const createContact = async (req, res) => {
  try {
    const contact = await contactModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "contact succesfully created",
      contact,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getContact = async (req, res) => {
  try {
    const contact = await contactModel.find();
    res.status(200).json({
      success: true,
      message: "contact succesfully fetch",
      contact,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { createContact, getContact };
