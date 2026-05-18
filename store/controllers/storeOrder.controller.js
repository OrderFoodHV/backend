const db = require("../../config/db");
const { ok, success, fail } = require("../../utils/response");

exports.getOrders = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    const { status, page = 1, limit = 20, from, to } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = "WHERE o.store_id = ?";
    const params = [storeId];
    if (status) { where += " AND o.status = ?"; params.push(status); }
    if (from && to) { where += " AND o.created_at BETWEEN ? AND ?"; params.push(from, to); }
    const [countResult] = await db.query(`SELECT COUNT(*) as total FROM orders o ${where}`, params);
    const total = countResult[0].total;
    const [orders] = await db.query(
      `SELECT o.*, u.name as customer_name, u.phone as customer_phone
       FROM orders o LEFT JOIN users u ON o.user_id = u.id ${where}
       ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    return ok(res, { orders, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { next(err); }
};

exports.getOrderDetail = async (req, res, next) => {
  try {
    const { storeId, orderId } = req.params;
    const [orders] = await db.query(
      `SELECT o.*, u.name as customer_name, u.phone as customer_phone
       FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = ? AND o.store_id = ?`,
      [orderId, storeId]
    );
    if (orders.length === 0) return fail(res, 404, "Không tìm thấy đơn hàng");
    const [items] = await db.query(
      `SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`, [orderId]
    );
    const [tracking] = await db.query("SELECT * FROM order_tracking WHERE order_id = ? ORDER BY created_at ASC", [orderId]);
    return ok(res, { ...orders[0], items, tracking });
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { storeId, orderId } = req.params;
    const { status, note } = req.body;
    const validStatus = ["confirmed", "delivering", "completed", "cancelled"];
    if (!validStatus.includes(status)) return fail(res, 400, "Trạng thái không hợp lệ");
    const [orders] = await db.query("SELECT * FROM orders WHERE id = ? AND store_id = ?", [orderId, storeId]);
    if (orders.length === 0) return fail(res, 404, "Không tìm thấy đơn hàng");
    const transitions = { pending: ["confirmed", "cancelled"], confirmed: ["delivering", "cancelled"], delivering: ["completed"], completed: [], cancelled: [] };
    if (!transitions[orders[0].status]?.includes(status)) return fail(res, 400, `Không thể chuyển từ "${orders[0].status}" sang "${status}"`);
    await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
    await db.query("INSERT INTO order_tracking (order_id, status, note) VALUES (?, ?, ?)", [orderId, status, note || null]);
    const msgs = { confirmed: "đã được xác nhận", delivering: "đang được giao", completed: "đã hoàn thành", cancelled: "đã bị hủy bởi cửa hàng" };
    await db.query("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'order')", [orders[0].user_id, `Đơn hàng #${orderId}`, `Đơn hàng ${msgs[status]}`]);
    return success(res, `Đã cập nhật trạng thái thành: ${status}`);
  } catch (err) { next(err); }
};

exports.getOrderStats = async (req, res, next) => {
  try {
    const [stats] = await db.query("SELECT status, COUNT(*) as count FROM orders WHERE store_id = ? GROUP BY status", [req.params.storeId]);
    const result = { pending: 0, confirmed: 0, delivering: 0, completed: 0, cancelled: 0 };
    stats.forEach((s) => { result[s.status] = s.count; });
    result.total = Object.values(result).reduce((a, b) => a + b, 0);
    return ok(res, result);
  } catch (err) { next(err); }
};
