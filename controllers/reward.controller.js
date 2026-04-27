const db = require("../config/db");

// Lấy điểm thưởng của user
exports.getUserPoints = (req, res) => {
  const userId = req.params.userId;
  
  db.query(
    "SELECT * FROM rewards WHERE user_id = ?",
    [userId],
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data[0] || { user_id: userId, points: 0, total_points: 0 });
    }
  );
};

// Lịch sử điểm thưởng
exports.getPointHistory = (req, res) => {
  const userId = req.params.userId;
  
  db.query(
    "SELECT * FROM reward_history WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data);
    }
  );
};

// Cộng điểm sau khi đặt hàng
exports.addPoints = (req, res) => {
  const { user_id, order_id, points } = req.body;
  
  // Kiểm tra user đã có record rewards chưa
  db.query(
    "SELECT * FROM rewards WHERE user_id = ?",
    [user_id],
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (data.length === 0) {
        // Tạo mới
        db.query(
          "INSERT INTO rewards (user_id, points, total_points) VALUES (?, ?, ?)",
          [user_id, points, points],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
          }
        );
      } else {
        // Cập nhật
        db.query(
          "UPDATE rewards SET points = points + ?, total_points = total_points + ? WHERE user_id = ?",
          [points, points, user_id],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
          }
        );
      }
      
      // Thêm vào lịch sử
      db.query(
        "INSERT INTO reward_history (user_id, order_id, points, type, description) VALUES (?, ?, ?, 'earn', ?)",
        [user_id, order_id, points, `Đơn hàng #${order_id}`],
        (err3) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ message: "Cộng điểm thành công", points });
        }
      );
    }
  );
};

// Đổi điểm thưởng
exports.redeemPoints = (req, res) => {
  const { user_id, points, voucher_code } = req.body;
  
  db.query(
    "SELECT * FROM rewards WHERE user_id = ?",
    [user_id],
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (data.length === 0 || data[0].points < points) {
        return res.status(400).json({ message: "Điểm không đủ" });
      }
      
      // Trừ điểm
      db.query(
        "UPDATE rewards SET points = points - ? WHERE user_id = ?",
        [points, user_id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
        }
      );
      
      // Thêm vào lịch sử
      db.query(
        "INSERT INTO reward_history (user_id, points, type, description) VALUES (?, ?, 'redeem', ?)",
        [user_id, -points, `Đổi voucher: ${voucher_code}`],
        (err3) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ message: "Đổi điểm thành công", voucher_code });
        }
      );
    }
  );
};