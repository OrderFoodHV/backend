const db = require("../config/db");

// Lấy tất cả thông báo của user
exports.getAll = (req, res) => {
  const userId = req.params.userId;
  
  db.query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data);
    }
  );
};

// Lấy thông báo chưa đọc
exports.getUnread = (req, res) => {
  const userId = req.params.userId;
  
  db.query(
    "SELECT * FROM notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC",
    [userId],
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data);
    }
  );
};

// Tạo thông báo mới
exports.create = (req, res) => {
  const { user_id, title, message, type } = req.body;
  
  db.query(
    "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
    [user_id, title, message, type || "general"],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Tạo thông báo thành công", id: result.insertId });
    }
  );
};

// Đánh dấu đã đọc
exports.markAsRead = (req, res) => {
  const { notificationId } = req.params;
  
  db.query(
    "UPDATE notifications SET is_read = 1 WHERE id = ?",
    [notificationId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Đánh dấu đã đọc" });
    }
  );
};

// Đánh dấu tất cả đã đọc
exports.markAllAsRead = (req, res) => {
  const { userId } = req.params;
  
  db.query(
    "UPDATE notifications SET is_read = 1 WHERE user_id = ?",
    [userId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Đánh dấu tất cả đã đọc" });
    }
  );
};

// Xóa thông báo
exports.delete = (req, res) => {
  const { notificationId } = req.params;
  
  db.query(
    "DELETE FROM notifications WHERE id = ?",
    [notificationId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Xóa thông báo thành công" });
    }
  );
};