const paymentService = require("../services/payment.service");
const catchAsync = require("../utils/catchAsync");

exports.pay = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { order_id, amount, method } = req.body;

  if (!order_id || !amount || !method) {
    const error = new Error("Thiếu thông tin thanh toán!");
    error.statusCode = 400;
    throw error;
  }

  const result = await paymentService.processPayment(
    order_id,
    userId,
    amount,
    method,
  );

  res.status(200).json({
    status: "success",
    data: result,
  });
});
