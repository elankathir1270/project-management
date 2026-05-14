const User = require("../models/user");
const ApiError = require("./../utilities/apiError");
const { generateAccessToken, generateRefreshToken,verifyRefreshToken  } = require("./../utilities/token");

//Register user
const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const payload = { userId: user._id, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

//Login user
const loginUser = async ({ email, password }) => {
  //Check email and password
  if (!email || email === " ") {
    throw new ApiError("Email is not provided", 400);
  }
  if (!password || password === " ") {
    throw new ApiError("Password is not provided", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "User with given email is not found");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid password");
  }

  const payload = { userId: user._id, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

//Refresh access token
const refreshAccessToken = async (refreshToken) => {
  if(!refreshToken){
    throw new ApiError(401, "Refresh token is missing");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  }catch(err) {
    throw new ApiError(400, "Invalid refresh token");
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  const payload = {
    userId: user._id,
    role: user.role
  }

  const newAccessToken = generateAccessToken(payload);

  return newAccessToken;

}

module.exports = {registerUser, loginUser, refreshAccessToken}
