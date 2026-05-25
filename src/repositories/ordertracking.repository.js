const db = require("../../config/db");

// Ghi nhận một mốc lịch sử di chuyển/trạng thái mới của đơn hàng vào bảng order_tracking
exports.insertLog = async (orderId, status, note) => {
  const [id] = await db("order_tracking").insert({
    order_id: orderId,
    status: status,
    note: note || `Đơn hàng chuyển sang trạng thái ${status}`,
  });
  return id;
};

// Lấy toàn bộ quá trình dịch chuyển trạng thái của 1 đơn hàng cụ thể
exports.getTrackingLogsByOrderId = async (orderId) => {
  return await db("order_tracking")
    .where({ order_id: orderId })
    .orderBy("created_at", "asc");
};
