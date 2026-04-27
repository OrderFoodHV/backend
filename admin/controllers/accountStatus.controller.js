const db = require("../../config/db");

// Quản lý trạng thái tài khoản - Lấy danh sách tài khoản
exports.getAccounts = (req, res) => {
  db.query(
    "SELECT id, name, email, phone, role, status, created_at FROM users ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// Cập nhật trạng thái tài khoản (active/inactive/banned)
exports.updateAccountStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["active", "inactive", "banned"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }

  db.query("UPDATE users SET status = ? WHERE id = ?", [status, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Cập nhật trạng thái tài khoản thành công" });
  });
};

// Khóa tài khoản
exports.banAccount = (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE users SET status = 'banned' WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Khóa tài khoản thành công" });
    }
  );
};

// Mở khóa tài khoản
exports.unbanAccount = (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE users SET status = 'active' WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Mở khóa tài khoản thành công" });
    }
  );
};

// Lấy chi tiết tài khoản
exports.getAccountDetail = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT id, name, email, phone, role, status, created_at FROM users WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy tài khoản" });
      res.json(results[0]);
    }
  );
};