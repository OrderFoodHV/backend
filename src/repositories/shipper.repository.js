const db = require("../../config/db");

// Tìm tài xế theo user_id
exports.findByUserId = async (userId) => {
  return await db("shippers").where({ user_id: userId }).first();
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (orderId, status, shipperId = null) => {
  const updateData = { status };
  if (shipperId) updateData.shipper_id = shipperId;

  return await db("orders").where({ id: orderId }).update(updateData);
};

// Ghi log tracking
exports.addTracking = async (orderId, status, note) => {
  return await db("order_tracking").insert({
    order_id: orderId,
    status,
    note,
  });
};
