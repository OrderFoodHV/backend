const orderService = require("../services/order.service");
const catchAsync = require("../utils/catchAsync");

exports.createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Kính chiếu yêu xem FE gửi bọc qua chữ 'data' hay gửi thẳng tuột
  console.log("🧨 DỮ LIỆU THỰC TẾ BE NHẬN ĐƯỢC LÀ:", req.body);

  // Giải quyết triệt để lỗi bọc biến của Formik/Redux Toolkit
  const finalData = req.body.data ? req.body.data : req.body;
  const { address, items, total_price } = finalData;

  if (!address) {
    const error = new Error("Vui lòng nhập địa chỉ giao hàng!");
    error.statusCode = 400;
    throw error;
  }

  // Đẩy sang Service xử lý nguyên cục
  const orderId = await orderService.checkout(
    userId,
    address,
    items,
    total_price,
  );

  // Trả về kết quả khớp với mong đợi của FE (.result)
  res.status(201).json({
    status: "success",
    message: "Đặt hàng thành công!",
    success: true,
    result: {
      order_id: orderId,
      address,
      total_price,
      order_status: "pending",
    },
  });
});

exports.getHistory = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const orders = await orderService.getOrders(userId);
  res.status(200).json({ status: "success", data: orders });
});
