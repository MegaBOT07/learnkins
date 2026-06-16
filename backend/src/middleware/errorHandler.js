export const errorHandler = (err, req, res, next) => {
  // Preserve the status code set earlier (for example the notFound middleware sets 404),
  // but default to 500 for unhandled errors.
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Log the original error for server-side debugging
  console.error(err);

  // Build a friendly message and map known error types to HTTP codes
  let message = err.message || 'Server Error';
  let mappedStatus = statusCode;

  if (err.name === 'CastError') {
    message = 'Resource not found';
    mappedStatus = 404;
  }

  if (err.code === 11000) {
    message = 'Account with this email or field already exists';
    mappedStatus = 400;
  }

  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
    mappedStatus = 400;
  }

  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    mappedStatus = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    mappedStatus = 401;
  }

  res.status(mappedStatus).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};