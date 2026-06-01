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

    // A. Nullify product_id in order_items for all products of this store to avoid FK constraint fails
    await db.query(
      "UPDATE order_items SET product_id = NULL WHERE product_id IN (SELECT id FROM products WHERE store_id = ?)",
      [id]
    );

    // B. Nullify store_id in orders for this store
    await db.query("UPDATE orders SET store_id = NULL WHERE store_id = ?", [id]);

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

// ── Shippers ──
exports.getAllShippers = async () => {
  const [rows] = await db.query(
    `SELECT s.id, s.phone, s.vehicle, s.status, s.created_at,
            u.name AS shipper_name, u.email AS shipper_email, u.id AS user_id
     FROM shippers s
     LEFT JOIN users u ON u.id = s.user_id
     ORDER BY s.created_at DESC`
  );
  return rows;
};

exports.setShipperStatus = async (id, status) => {
  if (status === "active" || status === "unblocked") {
    // Kích hoạt/Mở khóa tài xế -> trạng thái 'offline' (ngoại tuyến mặc định)
    await db.query("UPDATE shippers SET status = 'offline' WHERE id = ?", [id]);
    
    // Lấy user_id
    const [shippers] = await db.query("SELECT user_id, phone, vehicle FROM shippers WHERE id = ?", [id]);
    if (shippers && shippers.length > 0) {
      const userId = shippers[0].user_id;
      
      // Cập nhật is_shipper = 1 trong bảng users
      await db.query("UPDATE users SET is_shipper = 1 WHERE id = ?", [userId]);
      
      console.log(`🏍️ [Admin] Đã kích hoạt/mở khóa tài xế #${id}, cấp quyền is_shipper = 1 cho User #${userId}`);
      
      // Bắn socket real-time
      if (global._io) {
        global._io.to(`user_room_${userId}`).emit("shipper_approved", {
          shipperId: id,
          message: status === "unblocked" 
            ? `Tài khoản đối tác tài xế của bạn đã được mở khóa!`
            : `Chúc mừng! Yêu cầu làm đối tác tài xế của bạn đã được phê duyệt thành công.`,
        });
      }
      
      // Lưu thông báo hệ thống
      const notiService = require("../../src/services/notifications.service");
      await notiService.createNotification({
        userId: userId,
        role: "user",
        title: status === "unblocked" ? "Mở khóa tài xế! 🎉" : "Đăng ký tài xế thành công! 🎉",
        content: status === "unblocked"
          ? `Tài khoản đối tác tài xế của bạn đã được Admin mở khóa.`
          : `Chúc mừng bạn! Yêu cầu đăng ký làm tài xế với xe ${shippers[0].vehicle} đã được Admin duyệt thành công. Kênh tài xế của bạn đã sẵn sàng hoạt động.`,
        type: "general",
      }).catch(err => console.log("Lỗi tạo thông báo duyệt tài xế:", err));
    }
  } else if (status === "blocked") {
    // Tạm khóa tài xế -> trạng thái 'blocked'
    await db.query("UPDATE shippers SET status = 'blocked' WHERE id = ?", [id]);
    
    // Lấy user_id
    const [shippers] = await db.query("SELECT user_id, vehicle FROM shippers WHERE id = ?", [id]);
    if (shippers && shippers.length > 0) {
      const userId = shippers[0].user_id;
      
      // Cập nhật is_shipper = 0 trong bảng users
      await db.query("UPDATE users SET is_shipper = 0 WHERE id = ?", [userId]);
      
      console.log(`🔒 [Admin] Đã tạm khóa tài xế #${id}, thu hồi quyền is_shipper của User #${userId}`);
      
      // Bắn socket real-time
      if (global._io) {
        global._io.to(`user_room_${userId}`).emit("shipper_blocked", {
          shipperId: id,
          message: `Tài khoản đối tác tài xế của bạn đã bị Admin tạm khóa!`,
        });
      }
      
      // Lưu thông báo hệ thống
      const notiService = require("../../src/services/notifications.service");
      await notiService.createNotification({
        userId: userId,
        role: "user",
        title: "Tài khoản tài xế đã bị tạm khóa 🔒",
        content: `Tài khoản đối tác tài xế của bạn đã bị Admin tạm khóa. Mọi hoạt động giao nhận đơn tạm thời ngừng hoạt động.`,
        type: "general",
      }).catch(err => console.log("Lỗi tạo thông báo khóa tài xế:", err));
    }
  }
};

exports.deleteShipper = async (id) => {
  const [shippers] = await db.query("SELECT user_id FROM shippers WHERE id = ?", [id]);
  if (shippers && shippers.length > 0) {
    const userId = shippers[0].user_id;

    // A. Nullify shipper_id in orders for this driver to avoid FK constraint fails
    await db.query("UPDATE orders SET shipper_id = NULL WHERE shipper_id = ?", [id]);
    
    // Xóa khỏi bảng shippers
    await db.query("DELETE FROM shippers WHERE id = ?", [id]);
    
    // Cập nhật is_shipper = 0
    await db.query("UPDATE users SET is_shipper = 0 WHERE id = ?", [userId]);
    
    console.log(`🗑️ [Admin] Đã xóa tài xế #${id}, hủy quyền is_shipper của User #${userId}`);
    
    // Bắn socket real-time
    if (global._io) {
      global._io.to(`user_room_${userId}`).emit("shipper_deleted", {
        message: `Kênh tài xế của bạn đã bị từ chối/gỡ bỏ bởi Admin.`,
      });
    }
    
    // Lưu thông báo
    const notiService = require("../../src/services/notifications.service");
    await notiService.createNotification({
      userId: userId,
      role: "user",
      title: "Yêu cầu tài xế bị từ chối ❌",
      content: `Yêu cầu làm đối tác tài xế của bạn đã bị từ chối hoặc bị gỡ bởi Admin.`,
      type: "general",
    }).catch(err => console.log("Lỗi tạo thông báo xóa tài xế:", err));
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
    [
      name,
      description === undefined ? null : description,
      image === undefined ? null : image,
      status === undefined ? "active" : status,
      parent_id === undefined ? null : parent_id,
      id,
    ]
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
  const { fee_type, fee_value, fee_description, status, calculation_type, condition_type, condition_value, extra_value } = data;
  const [result] = await db.query(
    "INSERT INTO fee_settings (fee_type, fee_value, fee_description, status, calculation_type, condition_type, condition_value, extra_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [fee_type, fee_value, fee_description || null, status || "active", calculation_type || "fixed", condition_type || "none", condition_value || null, extra_value || 0]
  );
  return result.insertId;
};

exports.updateFeeById = async (id, data) => {
  const { fee_type, fee_value, fee_description, status, calculation_type, condition_type, condition_value, extra_value } = data;
  await db.query(
    "UPDATE fee_settings SET fee_type = ?, fee_value = ?, fee_description = ?, status = ?, calculation_type = ?, condition_type = ?, condition_value = ?, extra_value = ?, updated_at = NOW() WHERE id = ?",
    [fee_type, fee_value, fee_description, status || "active", calculation_type || "fixed", condition_type || "none", condition_value || null, extra_value || 0, id]
  );
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
            o.total_price AS order_total, o.delivery_photo
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
            o.total_price AS order_total, o.delivery_photo
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
// Helper to map mixed input data formats (from Admin Web page vs Backend APIs) to DB schema
const mapVoucherInputData = (data) => {
  const code = data.code;
  const min_order_amount = (data.min_order_amount === undefined || data.min_order_amount === null || data.min_order_amount === "") ? 0 : data.min_order_amount;
  
  let discount_percent = 0;
  let discount_amount = 0;
  
  if (data.discount_type !== undefined) {
    if (data.discount_type === 'percent') {
      discount_percent = parseFloat(data.discount_value) || 0;
      discount_amount = 0;
    } else {
      discount_amount = parseFloat(data.discount_value) || 0;
      discount_percent = 0;
    }
  } else {
    discount_percent = (data.discount_percent === undefined || data.discount_percent === null || data.discount_percent === "") ? 0 : data.discount_percent;
    discount_amount = (data.discount_amount === undefined || data.discount_amount === null || data.discount_amount === "") ? 0 : data.discount_amount;
  }
  
  const max_uses = data.quantity !== undefined ? data.quantity : (data.max_uses !== undefined ? data.max_uses : 100);
  
  let expired_at = null;
  if (data.end_date !== undefined) {
    expired_at = data.end_date || null;
  } else if (data.expired_at !== undefined) {
    expired_at = data.expired_at || null;
  }

  return {
    code,
    discount_percent,
    discount_amount,
    min_order_amount,
    max_uses,
    expired_at
  };
};

exports.getAllVouchers = async () => {
  const [rows] = await db.query("SELECT * FROM vouchers ORDER BY created_at DESC");
  return rows.map(v => {
    // Determine status
    let status = 'active';
    if (!v.is_active) {
      status = 'inactive';
    } else if (v.expired_at && new Date(v.expired_at) < new Date()) {
      status = 'expired';
    }

    return {
      ...v,
      discount_type: v.discount_percent > 0 ? 'percent' : 'fixed',
      discount_value: v.discount_percent > 0 ? v.discount_percent : parseFloat(v.discount_amount),
      quantity: v.max_uses,
      end_date: v.expired_at,
      status: status
    };
  });
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
  const mapped = mapVoucherInputData(data);
  const [result] = await db.query(
    `INSERT INTO vouchers (code, discount_percent, discount_amount, min_order_amount, max_uses, expired_at, is_active)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [mapped.code, mapped.discount_percent, mapped.discount_amount, mapped.min_order_amount, mapped.max_uses, mapped.expired_at]
  );
  return result.insertId;
};

exports.updateVoucher = async (id, data) => {
  const mapped = mapVoucherInputData(data);
  await db.query(
    `UPDATE vouchers SET code = ?, discount_percent = ?, discount_amount = ?,
     min_order_amount = ?, max_uses = ?, expired_at = ? WHERE id = ?`,
    [mapped.code, mapped.discount_percent, mapped.discount_amount, mapped.min_order_amount, mapped.max_uses, mapped.expired_at, id]
  );
};

exports.deleteVoucher = async (id) => {
  await db.query("DELETE FROM vouchers WHERE id = ?", [id]);
};

exports.setVoucherStatus = async (id, is_active) => {
  await db.query("UPDATE vouchers SET is_active = ? WHERE id = ?", [is_active, id]);
};
