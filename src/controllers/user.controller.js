const userService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");

exports.getMe = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Lấy từ Token
  const user = await userService.getProfile(userId);

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const message = await userService.updateProfile(userId, req.body);

  res.status(200).json({
    status: "success",
    message: message,
  });
});
