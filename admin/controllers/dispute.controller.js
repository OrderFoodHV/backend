const db = require("../../config/db");

// Giải quyết tranh chấp/Hoàn tiền - Lấy danh sách tranh chấp
exports.getDisputes = (req, res) => {
  db.query(
    `SELECT d.id, d.order_id, d.user_id, d.partner_id, d.reason, d.status, 
            d.resolution, d.refund_amount, d.created_at, d.resolved_at,
            u.name as user_name, p.name as partner_name
     FROM disputes d
     LEFT JOIN users u ON d.user_id = u.id
     LEFT JOIN partners p ON d.partner_id = p.id
     ORDER BY d.created_at DESC`,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// Lấy chi tiết tranh chấp
exports.getDisputeDetail = (req, res) => {
  const { id } = req.params;
  db.query(
    `SELECT d.*, u.name as user_name, u.email as user_email, 
            p.name as partner_name, p.email as partner_email
     FROM disputes d
     LEFT JOIN users u ON d.user_id = u.id
     LEFT JOIN partners p ON d.partner_id = p.id
     WHERE d.id = ?`,
    [id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy tranh chấp" });
      res.json(results[0]);
    }
  );
};

// Giải quyết tranh chấp
exports.resolveDispute = (req, res) => {
  const { id } = req.params;
  const { resolution, refund_amount, status } = req.body;

  db.query(
    "UPDATE disputes SET resolution = ?, refund_amount = ?, status = ?, resolved_at = NOW() WHERE id = ?",
    [resolution, refund_amount, status, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Giải quyết tranh chấp thành công" });
    }
  );
};

// Hoàn tiền cho khách hàng
exports.processRefund = (req, res) => {
  const { id } = req.params;
  const { refund_amount } = req.body;

  // Cập nhật trạng thái tranh chấp và thực hiện hoàn tiền
  db.query(
    "UPDATE disputes SET status = 'refunded', refund_amount = ?, resolved_at = NOW() WHERE id = ?",
    [refund_amount, id],
    (err) => {
      if (err) return res.status(500).json(err);
      
      // TODO: Tích hợp với payment gateway để thực hiện hoàn tiền thực tế
      res.json({ message: "Hoàn tiền thành công", refund_amount });
    }
  );
};

// Từ chối tranh chấp
exports.rejectDispute = (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  db.query(
    "UPDATE disputes SET status = 'rejected', resolution = ?, resolved_at = NOW() WHERE id = ?",
    [reason, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Từ chối tranh chấp thành công" });
    }
  );
};

// Lấy danh sách yêu cầu hoàn tiền
exports.getRefundRequests = (req, res) => {
  db.query(
    `SELECT r.id, r.order_id, r.user_id, r.amount, r.reason, r.status, r.created_at,
            u.name as user_name
     FROM refund_requests r
     LEFT JOIN users u ON r.user_id = u.id
     WHERE r.status = 'pending'
     ORDER BY r.created_at DESC`,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// Duyệt hoàn tiền
exports.approveRefund = (req, res) => {
  const { id } = req.params;
  
  db.query(
    "UPDATE refund_requests SET status = 'approved' WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Duyệt hoàn tiền thành công" });
    }
  );
};