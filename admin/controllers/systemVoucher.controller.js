const db = require("../../config/db");
const { ok, created, success, fail } = require("../../utils/response");

exports.getSystemVouchers = async (req, res, next) => {
  try {
    const [results] = await db.query(
      `SELECT v.id, v.code, v.discount_type, v.discount_value, v.min_order_amount, 
              v.max_discount, v.quantity, v.used_count, v.start_date, v.end_date, v.status, v.created_at
       FROM system_vouchers v ORDER BY v.created_at DESC`
    );
    return ok(res, results);
  } catch (err) { next(err); }
};

exports.createSystemVoucher = async (req, res, next) => {
  try {
    const { code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date } = req.body;
    if (!code || !discount_type || !discount_value || !quantity) return fail(res, 400, "Vui lòng điền đầy đủ thông tin bắt buộc");
    if (!["percent", "fixed"].includes(discount_type)) return fail(res, 400, "Loại giảm giá không hợp lệ (percent hoặc fixed)");
    const [results] = await db.query(
      `INSERT INTO system_vouchers (code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date]
    );
    return created(res, { id: results.insertId }, "Tạo voucher hệ thống thành công");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return fail(res, 409, "Mã voucher này đã tồn tại");
    next(err);
  }
};

exports.updateSystemVoucher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date, status } = req.body;
    const [result] = await db.query(
      `UPDATE system_vouchers SET code=?, discount_type=?, discount_value=?, min_order_amount=?, 
       max_discount=?, quantity=?, start_date=?, end_date=?, status=? WHERE id=?`,
      [code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date, status, id]
    );
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy voucher");
    return success(res, "Cập nhật voucher hệ thống thành công");
  } catch (err) { next(err); }
};

exports.deleteSystemVoucher = async (req, res, next) => {
  try {
    const [result] = await db.query("DELETE FROM system_vouchers WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy voucher");
    return success(res, "Xóa voucher hệ thống thành công");
  } catch (err) { next(err); }
};

exports.activateVoucher = async (req, res, next) => {
  try {
    const [result] = await db.query("UPDATE system_vouchers SET status = 'active' WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy voucher");
    return success(res, "Kích hoạt voucher thành công");
  } catch (err) { next(err); }
};

exports.deactivateVoucher = async (req, res, next) => {
  try {
    const [result] = await db.query("UPDATE system_vouchers SET status = 'inactive' WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy voucher");
    return success(res, "Vô hiệu hóa voucher thành công");
  } catch (err) { next(err); }
};

exports.getVoucherStats = async (req, res, next) => {
  try {
    const [results] = await db.query(
      `SELECT v.id, v.code, v.quantity, v.used_count, (v.quantity - v.used_count) as remaining,
              ROUND((v.used_count / NULLIF(v.quantity, 0)) * 100, 2) as usage_rate
       FROM system_vouchers v ORDER BY usage_rate DESC`
    );
    return ok(res, results);
  } catch (err) { next(err); }
};