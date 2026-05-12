const catchAsync = require('./../utilities/catchAsync');

exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});