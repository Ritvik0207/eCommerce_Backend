const errorHandler = async (err, req, res, next) => {
  if (!res?.status) {
    res.status = 500;
    res.message = "Internal Server Error";
  }

  res.json({
    success: false,
    message: err.message,
  });
};

module.exports = errorHandler;
