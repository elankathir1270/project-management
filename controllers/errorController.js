const ApiError = require("../utilities/apiError");
const logger = require("./../utilities/logger");

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stackTrace,
    error: error,
  });
};

const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(error.statusCode).json({
      status: "Error",
      message: "Something went wrong please try again later",
    });
  }
};

const handleCastError = (error) => {
  const errorMessage = `Invalid value ${error.value}, for the property ${error.path}.`;
  return new ApiError(errorMessage, 400);
};

const duplicateKeyHandler = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];

  const errorMessage = `A document with field - ${field} and value - ${value} is already exist`;
  return new ApiError(errorMessage, 400);
};

const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((val) => val.message);
  const message = errors.join(". ");

  const errorMessage = `Invalid input data: ${message}`;
  return new ApiError(errorMessage, 400);
};

const handleJwtError = (error) => {
  const errorMessage = `Access token is not valid, please login again.`;
  return new ApiError(errorMessage, 401);
};

const handleTokenExpiredError = (error) => {
  const errorMessage = `Access token has expired, please login again.`;
  return new ApiError(errorMessage, 401);
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "Error";

  // Winston logging
  logger.error({
    message: error.message,
    stack: error.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else {
    let apiError = error; //or {...error, message: error.message}
    //{...error} spread way only copies only enumerable properties(ex: error.statusCode) by default Error object properties are NOT enumerable

    if (error.name === "CastError") {
      apiError = handleCastError(error);
    }
    if (error.code === 11000) {
      apiError = duplicateKeyHandler(error);
    }
    if (error.name === "ValidationError") {
      apiError = handleValidationError(error);
    }
    if (error.name === "JsonWebTokenError") {
      apiError = handleJwtError(error);
    }
    if (error.name === "TokenExpiredError") {
      apiError = handleTokenExpiredError(error);
    }
    prodErrors(res, apiError);
  }
};
