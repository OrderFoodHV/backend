const db = require("../../config/db");

exports.getAvailableOrders = async () => {
  return await db("orders")
    .where({ status: "Quán đã nhận đơn", shipper_id: null })
    .select("id", "total_price", "address", "created_at");
};

exports.acceptOrder = async (userId, orderId) => {
  return await db.transaction(async (trx) => {
    const shipper = await trx("shippers").where({ user_id: userId }).first();
    if (!shipper) throw new Error("Tài xế không tồn tại");

    // 1. Cập nhật đơn hàng: Gán shipper_id nhưng GIỮ NGUYÊN trạng thái 'Quán đã nhận đơn' để cửa hàng xác nhận giao
    const affectedRows = await trx("orders")
      .where({ id: orderId, status: "Quán đã nhận đơn", shipper_id: null })
      .update({
        shipper_id: shipper.id,
      });

    if (affectedRows === 0)
      throw new Error("Đơn hàng đã có người nhận hoặc không tồn tại!");

    // 2. Ghi vào order_tracking
    await trx("order_tracking").insert({
      order_id: orderId,
      status: "Tài xế nhận đơn",
      note: "Tài xế đã nhận đơn và đang di chuyển tới quán.",
    });

    return "Đã nhận đơn thành công!";
  });
};

exports.completeOrder = async (userId, orderId, deliveryPhoto) => {
  return await db.transaction(async (trx) => {
    const shipper = await trx("shippers").where({ user_id: userId }).first();
    if (!shipper) throw new Error("Tài xế không tồn tại");

    // 1. Cập nhật trạng thái và ảnh bằng chứng giao hàng
    await trx("orders")
      .where({ id: orderId, shipper_id: shipper.id }) // Dùng shipper.id thay cho userId
      .update({ 
        status: "completed",
        delivery_photo: deliveryPhoto || null
      });

    // 2. Ghi log hoàn thành
    await trx("order_tracking").insert({
      order_id: orderId,
      status: "completed",
      note: "Đơn hàng đã được giao thành công.",
    });

    return "Đã hoàn thành đơn!";
  });
};
