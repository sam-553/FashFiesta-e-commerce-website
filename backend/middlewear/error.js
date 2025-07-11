const HandleErrorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle invalid ObjectId errors from Mongoose
  if (err.name === 'CastError') {
    message = `Resource not found. Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  // Handle duplicate key errors (e.g., unique fields like email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `This ${field} is already registered. Please login to continue.`;
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token. Please try again.';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Your session has expired. Please login again.';
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};

export default HandleErrorMiddleware;
