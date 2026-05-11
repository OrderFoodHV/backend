const trackingService = require("../services/ordertracking.service");
const catchAsync = require("../utils/catchAsync");

exports.getHistory = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const history = await trackingService.getUserHistory(userId);

  res.status(200).json({
    status: "success",
    data: history,
  });
});

exports.getDetails = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { orderId } = req.params; // Lấy ID từ URL (VD: /tracking/1)

  const details = await trackingService.getOrderDetails(orderId, userId);

  res.status(200).json({
    status: "success",
    data: details,
  });
});

// Cái này thường dành cho Shipper (Nên thêm phân quyền role sau)
exports.updateStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const message = await trackingService.changeStatus(orderId, status);

  res.status(200).json({
    status: "success",
    message: message,
  });
});
