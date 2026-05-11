const orderRepo = require("../repositories/order.repository");

// 1. Logic lấy lịch sử đơn hàng
exports.getUserHistory = async (userId) => {
  const orders = await orderRepo.findOrdersByUser(userId);
  return orders;
};

// 2. Logic xem chi tiết 1 đơn hàng
exports.getOrderDetails = async (orderId, userId) => {
  // Bổ sung security: Móc đơn ra xem có đúng của ông khách này không
  const orders = await orderRepo.findOrdersByUser(userId);
  const isOwner = orders.find((o) => o.id == orderId);

  if (!isOwner) {
    const error = new Error("Đơn hàng không tồn tại hoặc không phải của bạn!");
    error.statusCode = 403;
    throw error;
  }

  const items = await orderRepo.findOrderItemsDetails(orderId);
  return {
    order_info: isOwner,
    items: items,
  };
};

// 3. Logic Shipper cập nhật trạng thái
exports.changeStatus = async (orderId, newStatus) => {
  const allowedStatuses = [
    "pending",
    "cooking",
    "shipping",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(newStatus)) {
    const error = new Error("Trạng thái không hợp lệ!");
    error.statusCode = 400;
    throw error;
  }

  await orderRepo.updateOrderStatus(orderId, newStatus);
  return `Đã chuyển đơn hàng sang trạng thái: ${newStatus}`;
};
