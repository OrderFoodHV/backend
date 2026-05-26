const db = require("../../config/db");

// ── Dashboard Stats ──
exports.getStats = async () => {
  const [[users], [stores], [orders], [disputes]] = await Promise.all([
    db.query("SELECT COUNT(*) AS count FROM users"),
    db.query("SELECT COUNT(*) AS count FROM stores"),
    db.query("SELECT COUNT(*) AS count FROM orders"),
    db.query("SELECT COUNT(*) AS count FROM disputes"),
  ]);
  return {
    total_users:    users[0].count,
    total_stores:   stores[0].count,
    total_orders:   orders[0].count,
    total_disputes: disputes[0].count,
  };
};

// ── Accounts ──
exports.getAllAccounts = async () => {
  const [rows] = await db.query(
    "SELECT id, name, email, phone, role, is_seller, is_shipper, status, created_at FROM users ORDER BY created_at DESC"
  );
  return rows;
};

exports.getAccountById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, name, email, phone, role, is_seller, is_shipper, status, created_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

exports.setAccountStatus = async (id, status) => {
  await db.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
};

// ── Partners (dùng bảng stores vì đây là đối tác cửa hàng) ──
exports.getAllPartners = async () => {
  const [rows] = await db.query(
    `SELECT s.id, s.name, s.address, s.phone, s.status, s.created_at,
            u.name AS owner_name, u.email AS owner_email
     FROM stores s
     LEFT JOIN users u ON u.id = s.owner_id
     ORDER BY s.created_at DESC`
  );
  return rows;
};

exports.updatePartner = async (id, data) => {
  const { name, address, phone, status } = data;
  await db.query(
    "UPDATE stores SET name = ?, address = ?, phone = ?, status = ? WHERE id = ?",
    [name, address, phone, status, id]
  );
};

exports.deletePartner = async (id) => {
  // 1. Lấy owner_id và tên của store trước khi xóa
  const [stores] = await db.query("SELECT owner_id, name FROM stores WHERE id = ?", [id]);
  if (stores && stores.length > 0) {
    const ownerId = stores[0].owner_id;
    const storeName = stores[0].name;

    // 2. Xóa toàn bộ sản phẩm (thực đơn) của quán đó
    await db.query("DELETE FROM products WHERE store_id = ?", [id]);

    // 3. Xóa cửa hàng khỏi bảng stores
    await db.query("DELETE FROM stores WHERE id = ?", [id]);

    // 4. Cập nhật quyền người bán của user về 0
    await db.query("UPDATE users SET is_seller = 0 WHERE id = ?", [ownerId]);

    console.log(`🗑️ [Admin] Đã xóa quán #${id} (${storeName}), xóa sạch thực đơn và hủy quyền is_seller của User #${ownerId}`);

    // 5. Bắn socket thời gian thực báo cho chủ quán
    if (global._io) {
      global._io.to(`user_room_${ownerId}`).emit("store_deleted", {
        message: `Kênh người bán của cửa hàng "${storeName}" đã bị xóa bởi Admin. Sếp vui lòng đăng ký lại nếu có nhu cầu tiếp tục bán hàng.`,
      });
    }

    // 6. Tạo thông báo hệ thống
    const notiService = require("../../src/services/notifications.service");
    await notiService.createNotification({
      userId: ownerId,
      role: "user",
      title: "Cửa hàng đã bị xóa ❌",
      content: `Kênh người bán của cửa hàng "${storeName}" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.`,
      type: "store_deleted",
    }).catch(err => console.log("Lỗi tạo thông báo xóa quán:", err));
  }
};

exports.setPartnerStatus = async (id, status) => {
  await db.query("UPDATE stores SET status = ? WHERE id = ?", [status, id]);

  if (status === "active") {
    // Lấy owner_id của store
    const [stores] = await db.query("SELECT owner_id, name FROM stores WHERE id = ?", [id]);
    if (stores && stores.length > 0) {
      const ownerId = stores[0].owner_id;
      const storeName = stores[0].name;
      // Kích hoạt quyền người bán (is_seller = 1) cho chủ quán
      await db.query("UPDATE users SET is_seller = 1 WHERE id = ?", [ownerId]);
      console.log(`🏪 [Admin] Đã duyệt quán #${id}, cấp quyền is_seller = 1 cho User #${ownerId}`);

      // BẮN SOCKET THỜI GIAN THỰC CHO CHỦ QUÁN
      if (global._io) {
        global._io.to(`user_room_${ownerId}`).emit("store_approved", {
          storeId: id,
          storeName: storeName,
          message: `Chúc mừng sếp! Yêu cầu mở cửa hàng "${storeName}" của sếp đã được phê duyệt thành công.`,
        });
      }

      // TẠO THÔNG BÁO TRONG HỆ THỐNG
      const notiService = require("../../src/services/notifications.service");
      await notiService.createNotification({
        userId: ownerId,
        role: "user",
        title: "Cửa hàng đã được phê duyệt! 🎉",
        content: `Chúc mừng sếp! Yêu cầu đăng ký mở quán "${storeName}" đã được Admin duyệt thành công. Kênh người bán của sếp đã sẵn sàng hoạt động.`,
        type: "store_approval",
      }).catch(err => console.log("Lỗi tạo thông báo duyệt quán:", err));
    }
  } else if (status === "blocked" || status === "inactive") {
    // Hủy quyền người bán nếu quán bị khóa/tạm dừng
    const [stores] = await db.query("SELECT owner_id FROM stores WHERE id = ?", [id]);
    if (stores && stores.length > 0) {
      const ownerId = stores[0].owner_id;
      await db.query("UPDATE users SET is_seller = 0 WHERE id = ?", [ownerId]);
      console.log(`🏪 [Admin] Đã khóa/tạm dừng quán #${id}, hủy quyền is_seller = 0 cho User #${ownerId}`);
    }
  }
};

// ── Categories ──
exports.getAllCategories = async () => {
  const [rows] = await db.query(
    "SELECT * FROM categories ORDER BY created_at DESC"
  );
  return rows;
};

exports.createCategory = async (data) => {
  const { name, description, image, status, parent_id } = data;
  const [result] = await db.query(
    "INSERT INTO categories (name, description, image, status, parent_id) VALUES (?, ?, ?, ?, ?)",
    [name, description || null, image || null, status || "active", parent_id || null]
  );
  return result.insertId;
};

exports.updateCategory = async (id, data) => {
  const { name, description, image, status, parent_id } = data;
  await db.query(
    "UPDATE categories SET name = ?, description = ?, image = ?, status = ?, parent_id = ? WHERE id = ?",
    [name, description, image, status, parent_id, id]
  );
};

exports.deleteCategory = async (id) => {
  await db.query("DELETE FROM categories WHERE id = ?", [id]);
};

exports.setCategoryStatus = async (id, status) => {
  await db.query("UPDATE categories SET status = ? WHERE id = ?", [status, id]);
};

// ── Fees ──
exports.getAllFees = async () => {
  const [rows] = await db.query("SELECT * FROM fee_settings ORDER BY created_at DESC");
  return rows;
};

exports.updateFeeByType = async (type, data) => {
  const { fee_value, fee_description } = data;
  await db.query(
    "UPDATE fee_settings SET fee_value = ?, fee_description = ?, updated_at = NOW() WHERE fee_type = ?",
    [fee_value, fee_description, type]
  );
};

exports.createFee = async (data) => {
  const { fee_type, fee_value, fee_description, status } = data;
  const [result] = await db.query(
    "INSERT INTO fee_settings (fee_type, fee_value, fee_description, status) VALUES (?, ?, ?, ?)",
    [fee_type, fee_value, fee_description || null, status || "active"]
  );
  return result.insertId;
};

exports.setFeeStatus = async (id, status) => {
  await db.query("UPDATE fee_settings SET status = ?, updated_at = NOW() WHERE id = ?", [status, id]);
};

exports.deleteFee = async (id) => {
  await db.query("DELETE FROM fee_settings WHERE id = ?", [id]);
};

// Backward compat
exports.updateFee = async (fee_type, fee_value) => {
  await db.query(
    "UPDATE fee_settings SET fee_value = ?, updated_at = NOW() WHERE fee_type = ?",
    [fee_value, fee_type]
  );
};

// ── Disputes ──
exports.getAllDisputes = async () => {
  const [rows] = await db.query(
    `SELECT d.*, u.name AS user_name, u.email AS user_email,
            o.total_price AS order_total
     FROM disputes d
     LEFT JOIN users u ON u.id = d.user_id
     LEFT JOIN orders o ON o.id = d.order_id
     ORDER BY d.created_at DESC`
  );
  return rows;
};

exports.getDisputeById = async (id) => {
  const [rows] = await db.query(
    `SELECT d.*, u.name AS user_name, u.email AS user_email,
            o.total_price AS order_total
     FROM disputes d
     LEFT JOIN users u ON u.id = d.user_id
     LEFT JOIN orders o ON o.id = d.order_id
     WHERE d.id = ?`,
    [id]
  );
  return rows[0] || null;
};

exports.resolveDispute = async (id, data) => {
  const { resolution } = data;
  await db.query(
    "UPDATE disputes SET status = 'resolved', resolution = ?, resolved_at = NOW() WHERE id = ?",
    [resolution, id]
  );
};

exports.refundDispute = async (id, refund_amount) => {
  await db.query(
    "UPDATE disputes SET status = 'refunded', refund_amount = ?, resolved_at = NOW() WHERE id = ?",
    [refund_amount, id]
  );
};

exports.rejectDispute = async (id, reason) => {
  await db.query(
    "UPDATE disputes SET status = 'rejected', resolution = ?, resolved_at = NOW() WHERE id = ?",
    [reason, id]
  );
};

// ── Refunds ──
exports.getAllRefunds = async () => {
  const [rows] = await db.query(
    `SELECT r.*, u.name AS user_name, u.email AS user_email
     FROM refund_requests r
     LEFT JOIN users u ON u.id = r.user_id
     ORDER BY r.created_at DESC`
  );
  return rows;
};

exports.approveRefund = async (id) => {
  await db.query(
    "UPDATE refund_requests SET status = 'approved', processed_at = NOW() WHERE id = ?",
    [id]
  );
};

// ── Vouchers ──
exports.getAllVouchers = async () => {
  const [rows] = await db.query("SELECT * FROM vouchers ORDER BY created_at DESC");
  return rows;
};

exports.getVoucherStats = async () => {
  const [[total], [active], [usages]] = await Promise.all([
    db.query("SELECT COUNT(*) AS count FROM vouchers"),
    db.query("SELECT COUNT(*) AS count FROM vouchers WHERE is_active = 1"),
    db.query("SELECT SUM(used_count) AS total_used FROM vouchers"),
  ]);
  return {
    total:      total[0].count,
    active:     active[0].count,
    total_used: usages[0].total_used || 0,
  };
};

exports.createVoucher = async (data) => {
  const { code, discount_percent, discount_amount, min_order_amount, max_uses, expired_at } = data;
  const [result] = await db.query(
    `INSERT INTO vouchers (code, discount_percent, discount_amount, min_order_amount, max_uses, expired_at, is_active)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [code, discount_percent || 0, discount_amount || 0, min_order_amount || 0, max_uses || 100, expired_at]
  );
  return result.insertId;
};

exports.updateVoucher = async (id, data) => {
  const { code, discount_percent, discount_amount, min_order_amount, max_uses, expired_at } = data;
  await db.query(
    `UPDATE vouchers SET code = ?, discount_percent = ?, discount_amount = ?,
     min_order_amount = ?, max_uses = ?, expired_at = ? WHERE id = ?`,
    [code, discount_percent, discount_amount, min_order_amount, max_uses, expired_at, id]
  );
};

exports.deleteVoucher = async (id) => {
  await db.query("DELETE FROM vouchers WHERE id = ?", [id]);
};

exports.setVoucherStatus = async (id, is_active) => {
  await db.query("UPDATE vouchers SET is_active = ? WHERE id = ?", [is_active, id]);
};
