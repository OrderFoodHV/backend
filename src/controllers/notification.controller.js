const notiService = require("../services/notifications.service");
const catchAsync = require("../utils/catchAsync");

exports.getAllNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const role = req.query.role || "user";
  const listNoti = await notiService.getUserNotifications(userId, role);
  res.status(200).json({ status: "success", data: listNoti });
});

exports.markReadAll = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  await notiService.readAllNotifications(userId);
  res
    .status(200)
    .json({ status: "success", message: "Đã đọc toàn bộ thông báo!" });
});
