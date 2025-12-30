/**
 * Centralized error handling middleware for Express.
 * Catches errors, logs them, and sends appropriate HTTP responses.
 *
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  console.error('--- Error Handler ---');
  console.error(`Path: ${req.path}`);
  console.error(`Method: ${req.method}`);
  console.error(`Error: ${err.message}`);
  console.error(err.stack); // Log the stack trace for debugging

  // Default error status code and message
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = err.message;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = err.errors ? err.errors.map(e => e.message).join(', ') : err.message;
  } else if (err.name === 'UnauthorizedError' || err.message === 'Unauthorized') {
    // For JWT errors from passport-jwt
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError' || err.message === 'Forbidden') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFound' || err.message === 'Not Found') {
    statusCode = 404;
    message = 'Not Found';
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409; // Conflict
    message = 'Resource Conflict';
    details = err.errors.map(e => e.message).join(', ');
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400; // Bad Request
    message = 'Invalid input: Foreign key constraint failed.';
    details = err.message;
  } else if (err.statusCode) { // Custom errors might have a statusCode property
    statusCode = err.statusCode;
    message = err.message;
  }

  // Send the error response
  res.status(statusCode).json({
    status: 'error',
    message: message,
    details: details,
    // In production, avoid sending detailed error stack traces to clients
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
