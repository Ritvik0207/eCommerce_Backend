const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const authenticateCustomer = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    req.user = null;
    res.statusCode = 401;
    throw new Error('Unauthorized');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    req.user = null;
    res.statusCode = 401;
    throw new Error('Unauthorized');
  }

  req.user = decoded;
  next();
});

module.exports = authenticateCustomer;
