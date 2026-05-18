const db = require("../../config/db");
const { ok, fail } = require("../../utils/response");

/**
 * SSE: Stream thông báo đơn mới real-time
 * GET /api/store/:storeId/notifications/stream
 * 
 * Client sử dụng EventSource API:
 *   const es = new EventSource('/api/store/1/notifications/stream', {
 *     headers: { 'Authorization': 'Bearer ...' }
 *   });
 *   es.onmessage = (e) => console.log(JSON.parse(e.data));
 */
exports.streamNewOrders = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;

    // Thiết lập SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Nginx support

    // Gửi comment để giữ kết nối
    res.write(":ok\n\n");

    // Theo dõi ID đơn hàng cuối cùng đã thông báo
    let lastOrderId = 0;

    // Lấy ID đơn mới nhất hiện tại làm mốc
    const [latest] = await db.query(
      "SELECT MAX(id) as max_id FROM orders WHERE store_id = ?",
      [storeId]
    );
    lastOrderId = latest[0].max_id || 0;

    // Polling mỗi 5 giây
    const interval = setInterval(async () => {
      try {
        const [newOrders] = await db.query(
          `SELECT o.id, o.user_id, o.total_price, o.address, o.status, o.created_at,
                  u.name as customer_name, u.phone as customer_phone
           FROM orders o
           LEFT JOIN users u ON o.user_id = u.id
           WHERE o.store_id = ? AND o.id > ? AND o.status = 'pending'
           ORDER BY o.id ASC`,
          [storeId, lastOrderId]
        );

        if (newOrders.length > 0) {
          lastOrderId = newOrders[newOrders.length - 1].id;

          for (const order of newOrders) {
            // Lấy chi tiết sản phẩm trong đơn
            const [items] = await db.query(
              `SELECT oi.quantity, oi.price, p.name, p.image
               FROM order_items oi
               JOIN products p ON oi.product_id = p.id
               WHERE oi.order_id = ?`,
              [order.id]
            );

            const data = JSON.stringify({
              type: "new_order",
              order: { ...order, items },
              timestamp: new Date().toISOString(),
            });

            res.write(`data: ${data}\n\n`);
          }
        }
      } catch (err) {
        console.error("[SSE] Error polling orders:", err.message);
      }
    }, 5000);

    // Cleanup khi client ngắt kết nối
    req.on("close", () => {
      clearInterval(interval);
      res.end();
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Lấy đơn hàng mới gần đây (fallback cho SSE)
 * GET /api/store/:storeId/notifications/recent?minutes=30
 */
exports.getRecentOrders = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    const minutes = parseInt(req.query.minutes) || 30;

    const [orders] = await db.query(
      `SELECT o.id, o.user_id, o.total_price, o.address, o.status, o.created_at,
              u.name as customer_name, u.phone as customer_phone
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.store_id = ? AND o.created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
       ORDER BY o.created_at DESC`,
      [storeId, minutes]
    );

    return ok(res, orders, `Đơn hàng trong ${minutes} phút gần đây`);
  } catch (err) {
    next(err);
  }
};
