const db = require("../../config/db");

// Quản lý phí dịch vụ & Phí vận chuyển - Lấy cấu hình phí hiện tại
exports.getFeeSettings = (req, res) => {
  db.query(
    "SELECT id, fee_type, fee_value, fee_description, status, updated_at FROM fee_settings ORDER BY fee_type",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// Cập nhật phí dịch vụ
exports.updateServiceFee = (req, res) => {
  const { fee_value, fee_description } = req.body;

  db.query(
    "UPDATE fee_settings SET fee_value = ?, fee_description = ?, updated_at = NOW() WHERE fee_type = 'service_fee'",
    [fee_value, fee_description],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Cập nhật phí dịch vụ thành công" });
    }
  );
};

// Cập nhật phí vận chuyển
exports.updateShippingFee = (req, res) => {
  const { fee_value, fee_description } = req.body;

  db.query(
    "UPDATE fee_settings SET fee_value = ?, fee_description = ?, updated_at = NOW() WHERE fee_type = 'shipping_fee'",
    [fee_value, fee_description],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Cập nhật phí vận chuyển thành công" });
    }
  );
};

// Thêm cấu hình phí mới
exports.createFeeSetting = (req, res) => {
  const { fee_type, fee_value, fee_description } = req.body;

  if (!fee_type || !fee_value) {
    return res.status(400).json({ message: "Loại phí và giá trị là bắt buộc" });
  }

  db.query(
    "INSERT INTO fee_settings (fee_type, fee_value, fee_description) VALUES (?, ?, ?)",
    [fee_type, fee_value, fee_description],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Thêm cấu hình phí thành công", id: results.insertId });
    }
  );
};

// Cập nhật trạng thái cấu hình phí
exports.updateFeeStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE fee_settings SET status = ? WHERE id = ?",
    [status, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Cập nhật trạng thái phí thành công" });
    }
  );
};

// Xóa cấu hình phí
exports.deleteFeeSetting = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM fee_settings WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Xóa cấu hình phí thành công" });
  });
};