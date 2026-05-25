const { ok, success, fail, created } = require("../../src/utils/response");
const notificationService = require("../services/notification.service");

/**
 * SSE: Stream thông báo đơn mới real-time (ĐÃ NÂNG CẤP KẾT HỢP SOCKET VÀ SSE)
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

    // 🌟 THÊM MỚI: BẮN THÔNG BÁO THỜI GIAN THỰC QUA SOCKET.IO NGAY LẬP TỨC
    if (global._io) {
      global._io.to(`store_room_${storeId}`).emit("store_connected", {
        message: "🔔 Đã thiết lập kênh realtime sấm sét thành công!",
      });
    }

    // Polling mỗi 5 giây (Giữ lại làm fallback dự phòng cho hệ thống cực kỳ an toàn)
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
