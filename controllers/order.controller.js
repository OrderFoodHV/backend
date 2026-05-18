const db = require("../config/db");
const { ok, created, success, fail } = require("../utils/response");

// 1. Tạo đơn hàng mới (có database transaction)
exports.createOrder = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const user_id = req.user.id;
    const { address } = req.body;
    if (!address || address.trim() === "") return fail(res, 400, "Vui lòng nhập địa chỉ giao hàng!");
    await conn.beginTransaction();
    const [cartRows] = await conn.query(
      `SELECT c.id as cart_id, IFNULL(SUM(p.price * ci.quantity), 0) as real_total, MAX(p.store_id) as store_id
       FROM carts c JOIN cart_items ci ON c.id = ci.cart_id JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = ? GROUP BY c.id`,
      [user_id]
    );
    if (cartRows.length === 0 || cartRows[0].real_total === 0) {
      await conn.rollback();
      return fail(res, 400, "Giỏ hàng trống!");
    }
    const cartId = cartRows[0].cart_id;
    const realTotal = cartRows[0].real_total;
    const storeId = cartRows[0].store_id;
    const [orderResult] = await conn.query(
      "INSERT INTO orders (user_id, store_id, total_price, address, status) VALUES (?, ?, ?, ?, 'pending')",
      [user_id, storeId, realTotal, address]
    );
    const newOrderId = orderResult.insertId;
    await conn.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       SELECT ?, ci.product_id, ci.quantity, p.price FROM cart_items ci
       JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = ?`,
      [newOrderId, cartId]
    );
    await conn.query("INSERT INTO order_tracking (order_id, status) VALUES (?, 'pending')", [newOrderId]);
    await conn.query("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);
    await conn.commit();
    return created(res, { order_id: newOrderId, total_paid: realTotal, status: "pending" }, "Đặt hàng thành công!");
  } catch (err) { await conn.rollback(); next(err); } finally { conn.release(); }
};

// 2. Lấy danh sách đơn hàng của user
exports.getUserOrders = async (req, res, next) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [req.user.id]
    );
    return ok(res, orders);
  } catch (err) { next(err); }
};

// 3. Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;
    const validStatus = ["pending", "confirmed", "delivering", "completed", "cancelled"];
    if (!validStatus.includes(status)) return fail(res, 400, "Trạng thái không hợp lệ");
    const [result] = await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, order_id]);
    if (result.affectedRows === 0) return fail(res, 404, "Đơn hàng không tồn tại");
    await db.query("INSERT INTO order_tracking (order_id, status) VALUES (?, ?)", [order_id, status]);
    return success(res, `Đã cập nhật trạng thái đơn hàng thành: ${status}`);
  } catch (err) { next(err); }
};

// 4. Lấy chi tiết đơn hàng (chỉ đơn của chính user)
exports.getOrderDetail = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const [data] = await db.query(
      `SELECT o.id, o.total_price, o.address, o.status, o.payment_status,
              oi.product_id, oi.quantity, oi.price, p.name, p.image
       FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id
       WHERE o.id = ? AND o.user_id = ?`,
      [id, user_id]
    );
    if (data.length === 0) return fail(res, 404, "Không tìm thấy đơn hàng");
    return ok(res, data);
  } catch (err) { next(err); }
};

// 5. Tracking đơn hàng
exports.getTracking = async (req, res, next) => {
  try {
    const [result] = await db.query(
      `SELECT ot.* FROM order_tracking ot JOIN orders o ON ot.order_id = o.id
       WHERE o.id = ? AND o.user_id = ? ORDER BY ot.created_at ASC`,
      [req.params.id, req.user.id]
    );
    return ok(res, result);
  } catch (err) { next(err); }
};
