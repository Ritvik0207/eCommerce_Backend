const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

const authenticateAdmin = asyncHandler(async (req, res, next) => {
  const jwtToken = req.cookies?.adminJwt;
  console.log('All cookies:', req.cookies);
  if (!jwtToken) {
    req.admin = null;
    res.statusCode = 401;
    throw new Error('Unauthorized');
  }

  const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);

  if (!mongoose.isValidObjectId(decodedToken._id)) {
    req.admin = null;
    res.statusCode = 401;
    throw new Error('Unauthorized');
  }

  const admin = await adminModel.findById(decodedToken._id);

  if (!admin) {
    req.admin = null;
    res.statusCode = 401;
    throw new Error('Unauthorized');
  }

  req.admin = admin;
  next();
});

module.exports = authenticateAdmin;
