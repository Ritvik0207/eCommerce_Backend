const errorHandler = (err, req, res, next) => {
  // Log error for debugging in production
  console.error('Error in errorHandler', err);

  // Set default status and message if not already set
  let message = err?._message || err?.message || 'Internal Server Error';

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const validationErrors = Object.values(err.errors).map(
      (error) => error.message
    );
    message = validationErrors.join(', ');
    res.statusCode = 400; // Set status code for validation errors
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    message = `Invalid ${err.path}: ${err.value}`;
    res.statusCode = 400; // Set status code for cast errors
  }

  const statusCode = res.statusCode || 500;

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  });
};

module.exports = errorHandler;
