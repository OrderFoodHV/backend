const orderService = require("../services/order.service");
const catchAsync = require("../utils/catchAsync");

exports.createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  // Lấy TOÀN BỘ dữ liệu FE gửi lên (Kể cả mảng items mua ngay)
  const { address, items, total_price, payment_method_value } = req.body;

  if (!address) {
    const error = new Error("Vui lòng nhập địa chỉ giao hàng!");
    error.statusCode = 400;
    throw error;
  }

  // Đẩy sang Service xử lý, ném luôn mảng items và total_price xuống
  const orderId = await orderService.checkout(
    userId,
    address,
    items,
    total_price,
    payment_method_value,
  );

  res.status(201).json({
    status: "success",
    message: "Đặt hàng thành công!",
    data: { order_id: orderId },
  });
});

// Hàm hứng API lấy lịch sử đơn hàng
exports.getHistory = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const orders = await orderService.getOrders(userId);

  res.status(200).json({
    status: "success",
    data: orders, // Trả mảng orders về cho FE
  });
});
