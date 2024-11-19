const priceRangeModel = require("../models/priceRangeModel");

const createPriceRange = async (req, res) => {
  try {
    const { price_lower, price_upper, display_text } = req.body;
    const priceRange = await priceRangeModel.create({
      price_lower,
      price_upper,
      display_text,
    });
    res.status(201).json(priceRange);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllPriceRanges = async (req, res) => {
  try {
    const priceRanges = await priceRangeModel.find();
    res.status(200).json(priceRanges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPriceRange,
  getAllPriceRanges,
};
