// src/controllers/order.controller.js
const orderService = require("../services/order.service");
const catchAsync = require("../utils/catchAsync");
// 🌟 THÊM MỚI: Import service thông báo để ghi lịch sử cho User khi đặt đơn thành công
const notiService = require("../services/notifications.service");

exports.createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  console.log("🧨 DỮ LIỆU THỰC TẾ BE NHẬN ĐƯỢC LÀ:", req.body);

  const finalData = req.body.data ? req.body.data : req.body;

  let store_id = finalData.store_id;
  if (!store_id && finalData.items && finalData.items.length > 0) {
    store_id = finalData.items[0].store_id;
  }

  const { address, items, total_price, note, shipping_fee, service_fee, distance } = finalData;

  if (!address) {
    const error = new Error("Vui lòng nhập địa chỉ giao hàng!");
    error.statusCode = 400;
    throw error;
  }

  const { orderId, finalStoreId } = await orderService.checkout(
    userId,
    store_id,
    address,
    items,
    total_price,
    shipping_fee || 0,
    service_fee || 0,
    note || null,
    distance || null,
  );

  const orderPayloadForStore = {
    order_id: orderId,
    address,
    total_price: total_price || "Đang tính toán",
    status: "pending",
    note: note || null,
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
  // 🌟 THÊM MỚI: Ghi vết thông báo vào trang Lịch sử thông báo của User (Giai đoạn 1)
  // ========================================================
  await notiService.createNotification({
    userId: userId,
    role: "user",
    title: "Đặt hàng thành công! 🛒",
    content: `Đơn hàng #${orderId} của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!`,
    type: "order",
  });
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

exports.getHistory = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const orders = await orderService.getOrders(userId);
  res.status(200).json({ status: "success", data: orders });
});
