const orderService = require("../services/order.service");
const catchAsync = require("../utils/catchAsync");

exports.createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { address } = req.body;

  if (!address) {
    const error = new Error("Vui lòng nhập địa chỉ giao hàng!");
    error.statusCode = 400;
    throw error;
  }

  // Đẩy sang Service xử lý
  const orderId = await orderService.checkout(userId, address);

  // Trả về kết quả
  res.status(201).json({
    status: "success",
    message: "Đặt hàng thành công!",
    data: { order_id: orderId },
  });
});
