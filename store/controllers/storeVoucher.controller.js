const db = require("../../config/db");
const { ok, created, success, fail } = require("../../utils/response");

exports.getVouchers = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    const { status } = req.query;
    let sql = "SELECT * FROM store_vouchers WHERE store_id = ?";
    const params = [storeId];
    if (status) { sql += " AND status = ?"; params.push(status); }
    sql += " ORDER BY created_at DESC";
    const [data] = await db.query(sql, params);
    return ok(res, data);
  } catch (err) { next(err); }
};

exports.createVoucher = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    const { code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date } = req.body;
    if (!code || !discount_type || !discount_value || !end_date) return fail(res, 400, "Thiếu thông tin bắt buộc (code, discount_type, discount_value, end_date)");
    const [result] = await db.query(
      `INSERT INTO store_vouchers (store_id, code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [storeId, code, discount_type, discount_value, min_order_amount || 0, max_discount || 0, quantity || 100, start_date || null, end_date]
    );
    return created(res, { id: result.insertId }, "Tạo voucher thành công");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return fail(res, 409, "Mã voucher này đã tồn tại trong cửa hàng");
    next(err);
  }
};

exports.updateVoucher = async (req, res, next) => {
  try {
    const { storeId, voucherId } = req.params;
    const { code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date } = req.body;
    const [result] = await db.query(
      `UPDATE store_vouchers SET code = IFNULL(?, code), discount_type = IFNULL(?, discount_type), discount_value = IFNULL(?, discount_value),
       min_order_amount = IFNULL(?, min_order_amount), max_discount = IFNULL(?, max_discount), quantity = IFNULL(?, quantity),
       start_date = IFNULL(?, start_date), end_date = IFNULL(?, end_date) WHERE id = ? AND store_id = ?`,
      [code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date, voucherId, storeId]
    );
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy voucher");
    return success(res, "Cập nhật voucher thành công");
  } catch (err) { next(err); }
};

exports.deleteVoucher = async (req, res, next) => {
  try {
    const { storeId, voucherId } = req.params;
    const [result] = await db.query("DELETE FROM store_vouchers WHERE id = ? AND store_id = ?", [voucherId, storeId]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy voucher");
    return success(res, "Xóa voucher thành công");
  } catch (err) { next(err); }
};

exports.toggleVoucher = async (req, res, next) => {
  try {
    const { storeId, voucherId } = req.params;
    const [vouchers] = await db.query("SELECT status FROM store_vouchers WHERE id = ? AND store_id = ?", [voucherId, storeId]);
    if (vouchers.length === 0) return fail(res, 404, "Không tìm thấy voucher");
    const newStatus = vouchers[0].status === "active" ? "inactive" : "active";
    await db.query("UPDATE store_vouchers SET status = ? WHERE id = ?", [newStatus, voucherId]);
    return success(res, `Voucher đã ${newStatus === "active" ? "BẬT" : "TẮT"}`);
  } catch (err) { next(err); }
};
