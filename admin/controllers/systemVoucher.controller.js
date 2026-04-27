const db = require("../../config/db");

// Quản lý Voucher hệ thống - Lấy danh sách voucher hệ thống
exports.getSystemVouchers = (req, res) => {
  db.query(
    `SELECT v.id, v.code, v.discount_type, v.discount_value, v.min_order_amount, 
            v.max_discount, v.quantity, v.used_count, v.start_date, v.end_date, 
            v.status, v.created_at
     FROM system_vouchers v
     ORDER BY v.created_at DESC`,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// Tạo voucher hệ thống mới
exports.createSystemVoucher = (req, res) => {
  const { code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date } = req.body;

  if (!code || !discount_type || !discount_value || !quantity) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin bắt buộc" });
  }

  db.query(
    `INSERT INTO system_vouchers (code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
    [code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Tạo voucher hệ thống thành công", id: results.insertId });
    }
  );
};

// Cập nhật voucher hệ thống
exports.updateSystemVoucher = (req, res) => {
  const { id } = req.params;
  const { code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date, status } = req.body;

  db.query(
    `UPDATE system_vouchers 
     SET code = ?, discount_type = ?, discount_value = ?, min_order_amount = ?, 
         max_discount = ?, quantity = ?, start_date = ?, end_date = ?, status = ?
     WHERE id = ?`,
    [code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date, status, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Cập nhật voucher hệ thống thành công" });
    }
  );
};

// Xóa voucher hệ thống
exports.deleteSystemVoucher = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM system_vouchers WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Xóa voucher hệ thống thành công" });
  });
};

// Cập nhật trạng thái voucher
exports.updateVoucherStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE system_vouchers SET status = ? WHERE id = ?",
    [status, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Cập nhật trạng thái voucher thành công" });
    }
  );
};

// Kích hoạt voucher
exports.activateVoucher = (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE system_vouchers SET status = 'active' WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Kích hoạt voucher thành công" });
    }
  );
};

// Vô hiệu hóa voucher
exports.deactivateVoucher = (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE system_vouchers SET status = 'inactive' WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Vô hiệu hóa voucher thành công" });
    }
  );
};

// Lấy thống kê sử dụng voucher
exports.getVoucherStats = (req, res) => {
  db.query(
    `SELECT v.id, v.code, v.quantity, v.used_count, 
            (v.quantity - v.used_count) as remaining,
            ROUND((v.used_count / v.quantity) * 100, 2) as usage_rate
     FROM system_vouchers v
     ORDER BY usage_rate DESC`,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};