const db = require("../../config/db");

exports.countOrders = async (where, params) => {
  const [result] = await db.query(
    `SELECT COUNT(*) as total FROM orders o ${where}`,
    params,
  );
  return result[0].total;
};

exports.getOrders = async (where, params, limit, offset) => {
  const [orders] = await db.query(
    `SELECT o.*, u.name as user_name, u.phone as user_phone
     FROM orders o LEFT JOIN users u ON o.user_id = u.id ${where}
     ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );
  return orders;
};

exports.getOrderByIdAndStore = async (orderId, storeId) => {
  const [orders] = await db.query(
    `SELECT o.*, u.name as customer_name, u.phone as customer_phone
     FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = ? AND o.store_id = ?`,
    [orderId, storeId],
  );
  return orders.length > 0 ? orders[0] : null;
};

exports.getOrderItems = async (orderId) => {
  const [items] = await db.query(
    `SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`,
    [orderId],
  );
  return items;
};

exports.getOrderTracking = async (orderId) => {
  const [tracking] = await db.query(
    "SELECT * FROM order_tracking WHERE order_id = ? ORDER BY created_at ASC",
    [orderId],
  );
  return tracking;
};

exports.updateStatus = async (orderId, status) => {
  await db.query("UPDATE orders SET status = ? WHERE id = ?", [
    status,
    orderId,
  ]);
};

exports.addTracking = async (orderId, status, note) => {
  await db.query(
    "INSERT INTO order_tracking (order_id, status, note) VALUES (?, ?, ?)",
    [orderId, status, note],
  );
};

exports.addNotification = async (userId, title, message) => {
  await db.query(
    "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'order')",
    [userId, title, message],
  );
};

exports.getStats = async (storeId) => {
  const [stats] = await db.query(
    "SELECT status, COUNT(*) as count FROM orders WHERE store_id = ? GROUP BY status",
    [storeId],
  );
  return stats;
};
