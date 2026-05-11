const db = require("../../config/db");

// Tìm thông tin Shipper từ ID của User đang đăng nhập
exports.findShipperByUserId = async (userId) => {
  return await db("shippers").where({ user_id: userId }).first();
};

// Tìm các đơn hàng chưa ai nhận (shipper_id đang trống)
exports.getAvailableOrders = async () => {
  return await db("orders")
    .whereNull("shipper_id")
    .whereIn("status", ["pending", "confirmed"])
    .select("id", "total_price", "address", "status", "created_at");
};

// Transaction: Nhận đơn hàng
exports.acceptOrderTransaction = async (shipperId, orderId) => {
  return await db.transaction(async (trx) => {
    // 1. Gắn ID shipper vào đơn hàng & đổi trạng thái
    await trx("orders").where({ id: orderId }).update({
      shipper_id: shipperId,
      status: "delivering",
    });

    // 2. Đổi trạng thái của Shipper thành đang bận đi giao
    await trx("shippers").where({ id: shipperId }).update({
      status: "delivering",
    });

    return true;
  });
};

// Transaction: Giao hàng thành công
exports.completeOrderTransaction = async (shipperId, orderId) => {
  return await db.transaction(async (trx) => {
    // 1. Đổi trạng thái đơn hàng thành hoàn thành
    await trx("orders").where({ id: orderId }).update({
      status: "completed",
    });

    // 2. Giải phóng Shipper về lại trạng thái rảnh (idle)
    await trx("shippers").where({ id: shipperId }).update({
      status: "idle",
    });

    return true;
  });
};
