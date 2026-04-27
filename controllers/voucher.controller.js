const db = require("../config/db");

// Lấy tất cả voucher
exports.getAll = (req, res) => {
  db.query("SELECT * FROM vouchers WHERE is_active = 1", (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
};

// Lấy voucher theo code
exports.getByCode = (req, res) => {
  const { code } = req.params;
  db.query(
    "SELECT * FROM vouchers WHERE code = ? AND is_active = 1",
    [code],
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (data.length === 0) return res.status(404).json({ message: "Voucher không hợp lệ" });
      
      const voucher = data[0];
      
      // Kiểm tra hạn sử dụng
      if (new Date(voucher.expired_at) < new Date()) {
        return res.status(400).json({ message: "Voucher đã hết hạn" });
      }
      
      // Kiểm tra số lượng
      if (voucher.used_count >= voucher.max_uses) {
        return res.status(400).json({ message: "Voucher đã hết lượt sử dụng" });
      }
      
      res.json(voucher);
    }
  );
};

// Tạo voucher mới (admin)
exports.create = (req, res) => {
  const { code, discount_percent, discount_amount, min_order_amount, max_uses, expired_at } = req.body;
  
  db.query(
    `INSERT INTO vouchers (code, discount_percent, discount_amount, min_order_amount, max_uses, expired_at, is_active) 
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [code, discount_percent || 0, discount_amount || 0, min_order_amount || 0, max_uses || 1, expired_at],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Tạo voucher thành công", id: result.insertId });
    }
  );
};

// Sử dụng voucher
exports.useVoucher = (req, res) => {
  const { code, order_id } = req.body;
  
  db.query(
    "SELECT * FROM vouchers WHERE code = ? AND is_active = 1",
    [code],
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (data.length === 0) return res.status(404).json({ message: "Voucher không hợp lệ" });
      
      const voucher = data[0];
      
      if (new Date(voucher.expired_at) < new Date()) {
        return res.status(400).json({ message: "Voucher đã hết hạn" });
      }
      
      if (voucher.used_count >= voucher.max_uses) {
        return res.status(400).json({ message: "Voucher đã hết lượt sử dụng" });
      }
      
      // Cập nhật số lượng đã dùng
      db.query(
        "UPDATE vouchers SET used_count = used_count + 1 WHERE id = ?",
        [voucher.id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ 
            message: "Áp dụng voucher thành công", 
            discount: voucher.discount_percent || voucher.discount_amount 
          });
        }
      );
    }
  );
};