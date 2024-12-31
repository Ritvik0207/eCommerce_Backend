const collectionModel = require('../models/shopModel');

const addCollection = async (req, res) => {
  try {
    const { name } = req.body;
    const collectionExist = await collectionModel.findOne({
      name,
    });
    if (collectionExist) return res.json('Collection exist');
    const collection = await new collectionModel({
      name,
    }).save();
    res.status(201).json({
      success: true,
      message: 'Collection succesfully Added',
      collection,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getCollection = async (req, res) => {
  try {
    const collection = await collectionModel.find();
    res.status(200).json({
      success: true,
      message: 'Collection succesfully fetch',
      collection,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { addCollection, getCollection };
