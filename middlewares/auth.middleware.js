const jwt = require('jsonwebtoken');
const ApiError = require('./../utilities/apiError');

const authMiddleware = (req, res, next) => {
  let token;

  //Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //If no token
  if (!token) {
    return next(new ApiError(401, 'Not authorized, no token'));
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded);

    //Attach user to request
    req.user = decoded;

    next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

module.exports = authMiddleware;