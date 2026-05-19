const { ok, success, fail, created } = require("../../src/utils/response");
const notificationService = require("../services/notification.service");

/**
 * SSE: Stream thông báo đơn mới real-time
 * GET /api/store/:storeId/notifications/stream
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

    let lastOrderId = await notificationService.getLatestOrderId(storeId);

    // Polling mỗi 5 giây
    const interval = setInterval(async () => {
      try {
        const result = await notificationService.pollNewOrders(
          storeId,
          lastOrderId,
        );

        if (result.orders.length > 0) {
          lastOrderId = result.nextLastOrderId;

          for (const order of result.orders) {
            const data = JSON.stringify({
              type: "new_order",
              order,
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
    const orders = await notificationService.getRecentOrders(
      req.params.storeId,
      req.query.minutes,
    );
    return ok(res, orders, `Đơn hàng trong thời gian gần đây`);
  } catch (err) {
    next(err);
  }
};
