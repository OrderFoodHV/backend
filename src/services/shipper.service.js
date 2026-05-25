const db = require("../../config/db");

exports.getAvailableOrders = async () => {
  return await db("orders")
    .where({ status: "pending" })
    .select("id", "total_price", "address", "created_at"); // Chỉ select những gì cần thiết
};

exports.acceptOrder = async (userId, orderId) => {
  // Dùng transaction để đảm bảo cả 2 bước đều chạy hoặc đều dừng
  return await db.transaction(async (trx) => {
    const shipper = await trx("shippers").where({ user_id: userId }).first();
    if (!shipper) throw new Error("Tài xế không tồn tại");

    // 1. Cập nhật đơn hàng
    const affectedRows = await trx("orders")
      .where({ id: orderId, status: "pending" })
      .update({
        shipper_id: shipper.id,
        status: "delivering",
      });

    if (affectedRows === 0)
      throw new Error("Đơn hàng đã có người nhận hoặc không tồn tại!");

    // 2. Ghi vào order_tracking (để Admin có dữ liệu)
    await trx("order_tracking").insert({
      order_id: orderId,
      status: "delivering",
      note: "Tài xế đã nhận đơn.",
    });

    return "Đã nhận đơn thành công!";
  });
};

exports.completeOrder = async (userId, orderId) => {
  return await db.transaction(async (trx) => {
    // 1. Cập nhật trạng thái
    await trx("orders")
      .where({ id: orderId, shipper_id: userId }) // Thêm shipper_id để bảo mật
      .update({ status: "completed" });

    // 2. Ghi log hoàn thành
    await trx("order_tracking").insert({
      order_id: orderId,
      status: "completed",
      note: "Đơn hàng đã được giao thành công.",
    });

    return "Đã hoàn thành đơn!";
  });
};
