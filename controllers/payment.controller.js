const db = require("../config/db");
const { ok, success, fail } = require("../utils/response");

exports.createPayment = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { order_id } = req.body;
    if (!order_id) return fail(res, 400, "Thiếu order_id");
    const [orders] = await db.query(
      "SELECT id, status, payment_status FROM orders WHERE id = ? AND user_id = ?",
      [order_id, user_id]
    );
    if (orders.length === 0) return fail(res, 404, "Không tìm thấy đơn hàng");
    const order = orders[0];
    if (order.payment_status === "paid") return fail(res, 400, "Đơn hàng này đã được thanh toán rồi");
    if (order.status === "cancelled") return fail(res, 400, "Không thể thanh toán đơn hàng đã hủy");
    await db.query("UPDATE orders SET payment_status = 'paid', status = 'confirmed' WHERE id = ?", [order_id]);
    await db.query("INSERT INTO order_tracking (order_id, status) VALUES (?, 'confirmed')", [order_id]);
    return ok(res, { order_id, payment_status: "paid" }, "Thanh toán thành công!");
  } catch (err) { next(err); }
};
