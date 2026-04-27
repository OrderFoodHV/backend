const db = require("../config/db");

// Lấy danh sách đơn hàng có thể hủy (chưa confirmed, chưa delivering)
exports.getCancellableOrders = (req, res) => {
  const userId = req.params.userId;
  db.query(
    `SELECT o.*, s.name as store_name 
     FROM orders o 
     LEFT JOIN stores s ON o.store_id = s.id 
     WHERE o.user_id = ? AND o.status IN ('pending') 
     ORDER BY o.created_at DESC`,
    [userId],
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data);
    }
  );
};

// Hủy đơn hàng
exports.cancelOrder = (req, res) => {
  const orderId = req.params.orderId;
  const { reason } = req.body;
  const userId = req.body.user_id;

  // Kiểm tra đơn hàng tồn tại và thuộc về user
  db.query(
    "SELECT * FROM orders WHERE id = ? AND user_id = ?",
    [orderId, userId],
    (err, orders) => {
      if (err) return res.status(500).json({ error: err.message });
      if (orders.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
      }

      const order = orders[0];

      // Chỉ cho phép hủy khi đơn ở trạng thái pending
      if (order.status !== 'pending') {
        return res.status(400).json({ 
          error: "Không thể hủy đơn hàng đã được xác nhận hoặc đang giao" 
        });
      }

      // Cập nhật trạng thái đơn hàng
      db.query(
        "UPDATE orders SET status = 'cancelled' WHERE id = ?",
        [orderId],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          // Lưu lịch sử hủy đơn (tùy chọn)
          if (reason) {
            db.query(
              "INSERT INTO order_tracking (order_id, status, note) VALUES (?, 'cancelled', ?)",
              [orderId, reason],
              (err) => {
                if (err) console.error("Lỗi lưu lịch sử hủy đơn:", err);
              }
            );
          }

          // Hoàn tiền voucher nếu đã sử dụng
          if (order.voucher_id) {
            db.query(
              "UPDATE vouchers SET used_count = used_count - 1 WHERE id = ? AND used_count > 0",
              [order.voucher_id],
              (err) => {
                if (err) console.error("Lỗi hoàn voucher:", err);
              }
            );
          }

          // Hoàn lại điểm thưởng nếu đã dùng
          db.query(
            "SELECT rh.id, rh.points FROM reward_history rh WHERE rh.order_id = ? AND rh.type = 'redeem'",
            [orderId],
            (err, rewardHistory) => {
              if (err) console.error("Lỗi lấy reward history:", err);
              if (rewardHistory && rewardHistory.length > 0) {
                const pointsToRefund = rewardHistory.reduce((sum, r) => sum + Math.abs(r.points), 0);
                db.query(
                  "UPDATE rewards SET total_points = total_points + ? WHERE user_id = ?",
                  [pointsToRefund, userId],
                  (err) => {
                    if (err) console.error("Lỗi hoàn điểm:", err);
                  }
                );
              }
            }
          );

          res.json({ message: "Hủy đơn hàng thành công" });
        }
      );
    }
  );
};

// Admin hủy đơn hàng của user khác
exports.adminCancelOrder = (req, res) => {
  const orderId = req.params.orderId;
  const { reason, admin_id } = req.body;

  db.query(
    "SELECT * FROM orders WHERE id = ?",
    [orderId],
    (err, orders) => {
      if (err) return res.status(500).json({ error: err.message });
      if (orders.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
      }

      const order = orders[0];

      // Admin có thể hủy bất kỳ đơn nào trừ đơn đã hoàn thành
      if (order.status === 'completed') {
        return res.status(400).json({ error: "Không thể hủy đơn hàng đã hoàn thành" });
      }

      db.query(
        "UPDATE orders SET status = 'cancelled' WHERE id = ?",
        [orderId],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          // Lưu lịch sử hủy
          db.query(
            "INSERT INTO order_tracking (order_id, status, note) VALUES (?, 'cancelled', ?)",
            [orderId, reason || 'Hủy bởi admin'],
            (err) => {
              if (err) console.error("Lỗi lưu lịch sử:", err);
            }
          );

          // Hoàn tiền cho user nếu đã thanh toán
          if (order.payment_status === 'paid') {
            // Logic hoàn tiền tùy theo payment gateway
            console.log(`Hoàn tiền cho đơn ${orderId}, user ${order.user_id}`);
          }

          res.json({ message: "Admin hủy đơn hàng thành công" });
        }
      );
    }
  );
};

// Lấy lịch sử hủy đơn
exports.getCancelledOrders = (req, res) => {
  const userId = req.params.userId;
  db.query(
    `SELECT o.*, s.name as store_name 
     FROM orders o 
     LEFT JOIN stores s ON o.store_id = s.id 
     WHERE o.user_id = ? AND o.status = 'cancelled' 
     ORDER BY o.created_at DESC`,
    [userId],
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data);
    }
  );
};