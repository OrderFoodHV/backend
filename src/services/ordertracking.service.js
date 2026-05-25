const orderRepo = require("../repositories/order.repository");
const trackingRepo = require("../repositories/ordertracking.repository");

exports.getUserHistory = async (userId) => {
  return await orderRepo.findOrdersByUser(userId);
};

exports.getOrderDetails = async (orderId, userId) => {
  const orders = await orderRepo.findOrdersByUser(userId);
  const isOwner = orders.find((o) => o.id == orderId);

  if (!isOwner) {
    const error = new Error("Đơn hàng không tồn tại hoặc không phải của bạn!");
    error.statusCode = 403;
    throw error;
  }

  const items = await orderRepo.findOrderItemsDetails(orderId);
  // Móc thêm cả mốc thời gian luân chuyển đơn từ bảng order_tracking ra trả về cho FE vẽ timeline
  const timelines = await trackingRepo.getTrackingLogsByOrderId(orderId);

  return {
    order_info: isOwner,
    items: items,
    timelines: timelines,
  };
};

exports.changeStatus = async (orderId, newStatus) => {
  const allowedStatuses = [
    "pending",
    "confirmed",
    "delivering",
    "completed",
    "cancelled",
  ];
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error("Trạng thái không hợp lệ!");
  }

  // 1. Cập nhật trạng thái chính ở bảng orders
  await orderRepo.updateOrderStatus(orderId, newStatus);

  // 2. Bắn thêm một dòng lịch sử vào bảng log order_tracking để đồng bộ thiết kế mới
  await trackingRepo.insertLog(
    orderId,
    newStatus,
    `Hệ thống cập nhật trạng thái đơn thành: ${newStatus}`,
  );

  return `Đã chuyển đơn hàng sang trạng thái: ${newStatus}`;
};
