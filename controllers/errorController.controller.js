const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details

  //?1) Log error
  console.error('ERROR 💥', err);

  //?2) Send generic message
  // Note: In production, we don't want to send the error details to the client
  // as it may contain sensitive information.
  // Instead, we send a generic message.
  // This is a security measure to prevent information leakage.
  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log('error', err);

    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    //? let error = { ...err } this fails because it could copy the prototype chain
    let error = {
      ...err,
      message: err.message,
      name: err.name,
      stack: err.stack,
    }; // This creates a shallow copy of the error object
    console.log('error1', error);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    // For production, we can send a more generic error message
    console.log('error2', error);

    sendErrorProd(error, res);
  }
};
