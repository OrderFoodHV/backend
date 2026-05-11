const shipperService = require("../services/shipper.service");
const catchAsync = require("../utils/catchAsync");

exports.viewAvailableOrders = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const orders = await shipperService.getAvailableOrders(userId);

  res.status(200).json({
    status: "success",
    data: orders,
  });
});

exports.accept = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  const message = await shipperService.acceptOrder(userId, orderId);

  res.status(200).json({
    status: "success",
    message: message,
  });
});

exports.complete = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  const message = await shipperService.completeOrder(userId, orderId);

  res.status(200).json({
    status: "success",
    message: message,
  });
});
