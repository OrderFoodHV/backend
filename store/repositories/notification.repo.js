const db = require("../../config/db");

exports.getLatestOrderId = async (storeId) => {
  const [latest] = await db.query(
    "SELECT MAX(id) as max_id FROM orders WHERE store_id = ?",
    [storeId],
  );
  return latest[0].max_id || 0;
};

exports.getNewOrders = async (storeId, lastOrderId) => {
  const [newOrders] = await db.query(
    `SELECT o.id, o.user_id, o.total_price, o.address, o.status, o.created_at,
            u.name as user_name, u.phone as customer_phone
     FROM orders o
     LEFT JOIN users u ON o.user_id = u.id
     WHERE o.store_id = ? AND o.id > ? AND o.status = 'pending'
     ORDER BY o.id ASC`,
    [storeId, lastOrderId],
  );
  return newOrders;
};

exports.getOrderItems = async (orderId) => {
  const [items] = await db.query(
    `SELECT oi.quantity, oi.price, p.name, p.image
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = ?`,
    [orderId],
  );
  return items;
};

exports.getRecentOrders = async (storeId, minutes) => {
  const [orders] = await db.query(
    `SELECT o.id, o.user_id, o.total_price, o.address, o.status, o.created_at,
            u.name as user_name, u.phone as customer_phone
     FROM orders o
     LEFT JOIN users u ON o.user_id = u.id
     WHERE o.store_id = ? AND o.created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
     ORDER BY o.created_at DESC`,
    [storeId, minutes],
  );
  return orders;
};
