const ApiError = require("../utils/apiError");

const sendErrorDevelopment = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProduction = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again..", 401);

const handleJwtExpiredToken = () =>
  new ApiError("Expired token, please login again..", 401);

const globalMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJwtExpiredToken();
    sendErrorProduction(err, res);
  } else {
    sendErrorDevelopment(err, res);
  }
};
module.exports = globalMiddleware;
