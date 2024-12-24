const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const authenticateCustomer = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    res.statusCode = 401;
    throw new Error('Unauthorized');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
});

module.exports = authenticateCustomer;
