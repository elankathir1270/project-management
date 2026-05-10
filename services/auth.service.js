const User = require("../models/user");
const ApiError = require("./../utilities/apiError");
const { generateAccessToken, generateRefreshToken } = require("./../utilities/token");

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

module.exports = {registerUser, loginUser}
