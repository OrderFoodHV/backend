// src/controllers/order.controller.js
const orderService = require("../services/order.service");
const catchAsync = require("../utils/catchAsync");

exports.createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  console.log("🧨 DỮ LIỆU THỰC TẾ BE NHẬN ĐƯỢC LÀ:", req.body);

  const finalData = req.body.data ? req.body.data : req.body;
  const { address, items, total_price, store_id } = finalData;

  if (!address) {
    const error = new Error("Vui lòng nhập địa chỉ giao hàng!");
    error.statusCode = 400;
    throw error;
  }

  // Đẩy sang Service làm việc
  const { orderId, finalStoreId } = await orderService.checkout(
    userId,
    store_id,
    address,
    items,
    total_price,
  );

  // ========================================================
  // ⚡ BÙA REAL-TIME SẤM SÉT: BẮN THÔNG BÁO CHO APP STORE CHỦ QUÁN
  // ========================================================
  const orderPayloadForStore = {
    order_id: orderId,
    address,
    total_price: total_price || "Đang tính toán",
    status: "pending",
    created_at: new Date(),
  };

  // Bắn tín hiệu đích danh vào phòng của Cửa hàng đó
  global._io.to(`store_room_${finalStoreId}`).emit("new_order", {
    success: true,
    message: "🔊 Ting Ting! Có đơn hàng mới tinh nè sếp ơi!",
    data: orderPayloadForStore,
  });
  console.log(
    `🚀 Đã phát tín hiệu nổ đơn thành công đến phòng: store_room_${finalStoreId}`,
  );
  // ========================================================

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

// 🔥 KHÔI PHỤC HÀM XEM LỊCH SỬ ĐƠN HÀNG (BỊ THIẾU CHÍ MẠNG Ở ĐÂY)
exports.getHistory = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const orders = await orderService.getOrders(userId);
  res.status(200).json({
    status: "success",
    data: orders,
  });
});
