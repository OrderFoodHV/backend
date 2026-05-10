const db = require("../config/db");
const { ok, created, success, fail } = require("../utils/response");

exports.getAll = async (req, res, next) => {
  try {
    const [data] = await db.query("SELECT * FROM vouchers WHERE is_active = 1 AND expired_at > NOW() ORDER BY expired_at ASC");
    return ok(res, data);
  } catch (err) { next(err); }
};

exports.getByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const [data] = await db.query("SELECT * FROM vouchers WHERE code = ? AND is_active = 1", [code]);
    if (data.length === 0) return fail(res, 404, "Voucher không hợp lệ");
    const voucher = data[0];
    if (new Date(voucher.expired_at) < new Date()) return fail(res, 400, "Voucher đã hết hạn");
    if (voucher.used_count >= voucher.max_uses) return fail(res, 400, "Voucher đã hết lượt sử dụng");
    return ok(res, voucher);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { code, discount_percent, discount_amount, min_order_amount, max_uses, expired_at } = req.body;
    if (!code || !expired_at) return fail(res, 400, "Thiếu thông tin bắt buộc (code, expired_at)");
    const [result] = await db.query(
      `INSERT INTO vouchers (code, discount_percent, discount_amount, min_order_amount, max_uses, expired_at, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [code, discount_percent || 0, discount_amount || 0, min_order_amount || 0, max_uses || 1, expired_at]
    );
    return created(res, { id: result.insertId }, "Tạo voucher thành công");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return fail(res, 409, "Mã voucher này đã tồn tại");
    next(err);
  }
};

exports.useVoucher = async (req, res, next) => {
  try {
    const { code } = req.body;
    const [data] = await db.query("SELECT * FROM vouchers WHERE code = ? AND is_active = 1", [code]);
    if (data.length === 0) return fail(res, 404, "Voucher không hợp lệ");
    const voucher = data[0];
    if (new Date(voucher.expired_at) < new Date()) return fail(res, 400, "Voucher đã hết hạn");
    if (voucher.used_count >= voucher.max_uses) return fail(res, 400, "Voucher đã hết lượt sử dụng");
    await db.query("UPDATE vouchers SET used_count = used_count + 1 WHERE id = ?", [voucher.id]);
    return ok(res, { discount: voucher.discount_percent || voucher.discount_amount }, "Áp dụng voucher thành công");
  } catch (err) { next(err); }
};