const db = require("../config/db");
const { ok, success, fail } = require("../utils/response");

exports.getCancellableOrders = async (req, res, next) => {
  try {
    const [data] = await db.query(
      `SELECT o.*, s.name as store_name FROM orders o LEFT JOIN stores s ON o.store_id = s.id 
       WHERE o.user_id = ? AND o.status IN ('pending') ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

exports.cancelOrder = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const orderId = req.params.orderId;
    const userId = req.user.id;
    const { reason } = req.body;
    await conn.beginTransaction();
    const [orders] = await conn.query("SELECT * FROM orders WHERE id = ? AND user_id = ?", [orderId, userId]);
    if (orders.length === 0) { await conn.rollback(); return fail(res, 404, "Không tìm thấy đơn hàng"); }
    const order = orders[0];
    if (order.status !== "pending") { await conn.rollback(); return fail(res, 400, "Không thể hủy đơn đã xác nhận hoặc đang giao"); }
    await conn.query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [orderId]);
    await conn.query("INSERT INTO order_tracking (order_id, status, note) VALUES (?, 'cancelled', ?)", [orderId, reason || "Khách hàng hủy đơn"]);
    if (order.voucher_id) await conn.query("UPDATE vouchers SET used_count = used_count - 1 WHERE id = ? AND used_count > 0", [order.voucher_id]);
    const [rh] = await conn.query("SELECT points FROM reward_history WHERE order_id = ? AND type = 'redeem'", [orderId]);
    if (rh.length > 0) {
      const pts = rh.reduce((s, r) => s + Math.abs(r.points), 0);
      await conn.query("UPDATE rewards SET total_points = total_points + ? WHERE user_id = ?", [pts, userId]);
    }
    await conn.commit();
    return success(res, "Hủy đơn hàng thành công");
  } catch (err) { await conn.rollback(); next(err); } finally { conn.release(); }
};

exports.adminCancelOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const { reason } = req.body;
    const [orders] = await db.query("SELECT * FROM orders WHERE id = ?", [orderId]);
    if (orders.length === 0) return fail(res, 404, "Không tìm thấy đơn hàng");
    const order = orders[0];
    if (order.status === "completed") return fail(res, 400, "Không thể hủy đơn đã hoàn thành");
    await db.query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [orderId]);
    await db.query("INSERT INTO order_tracking (order_id, status, note) VALUES (?, 'cancelled', ?)", [orderId, reason || "Hủy bởi admin"]);
    if (order.payment_status === "paid") console.log(`[REFUND NEEDED] Đơn #${orderId}, user #${order.user_id}`);
    return success(res, "Admin hủy đơn hàng thành công");
  } catch (err) { next(err); }
};

exports.getCancelledOrders = async (req, res, next) => {
  try {
    const [data] = await db.query(
      `SELECT o.*, s.name as store_name FROM orders o LEFT JOIN stores s ON o.store_id = s.id 
       WHERE o.user_id = ? AND o.status = 'cancelled' ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    return ok(res, data);
  } catch (err) { next(err); }
};