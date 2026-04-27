const db = require("../../config/db");

// Quản lý đối tác - Lấy danh sách đối tác
exports.getPartners = (req, res) => {
  db.query(
    "SELECT id, name, email, phone, address, status, created_at FROM partners ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// Cập nhật thông tin đối tác
exports.updatePartner = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, status } = req.body;

  db.query(
    "UPDATE partners SET name = ?, email = ?, phone = ?, address = ?, status = ? WHERE id = ?",
    [name, email, phone, address, status, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Cập nhật đối tác thành công" });
    }
  );
};

// Xóa đối tác
exports.deletePartner = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM partners WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Xóa đối tác thành công" });
  });
};

// Duyệt đối tác mới
exports.approvePartner = (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE partners SET status = 'active' WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Duyệt đối tác thành công" });
    }
  );
};