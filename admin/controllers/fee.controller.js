const db = require("../../config/db");
const { ok, created, success, fail } = require("../../utils/response");

exports.getFeeSettings = async (req, res, next) => {
  try {
    const [results] = await db.query("SELECT id, fee_type, fee_value, fee_description, status, updated_at FROM fee_settings ORDER BY fee_type");
    return ok(res, results);
  } catch (err) { next(err); }
};

exports.updateServiceFee = async (req, res, next) => {
  try {
    const { fee_value, fee_description } = req.body;
    if (fee_value === undefined || fee_value < 0) return fail(res, 400, "Giá trị phí không hợp lệ");
    await db.query("UPDATE fee_settings SET fee_value = ?, fee_description = ?, updated_at = NOW() WHERE fee_type = 'service_fee'", [fee_value, fee_description]);
    return success(res, "Cập nhật phí dịch vụ thành công");
  } catch (err) { next(err); }
};

exports.updateShippingFee = async (req, res, next) => {
  try {
    const { fee_value, fee_description } = req.body;
    if (fee_value === undefined || fee_value < 0) return fail(res, 400, "Giá trị phí không hợp lệ");
    await db.query("UPDATE fee_settings SET fee_value = ?, fee_description = ?, updated_at = NOW() WHERE fee_type = 'shipping_fee'", [fee_value, fee_description]);
    return success(res, "Cập nhật phí vận chuyển thành công");
  } catch (err) { next(err); }
};

exports.createFeeSetting = async (req, res, next) => {
  try {
    const { fee_type, fee_value, fee_description } = req.body;
    if (!fee_type || fee_value === undefined) return fail(res, 400, "Loại phí và giá trị là bắt buộc");
    const [results] = await db.query("INSERT INTO fee_settings (fee_type, fee_value, fee_description) VALUES (?, ?, ?)", [fee_type, fee_value, fee_description]);
    return created(res, { id: results.insertId }, "Thêm cấu hình phí thành công");
  } catch (err) { next(err); }
};

exports.updateFeeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["active", "inactive"].includes(status)) return fail(res, 400, "Trạng thái không hợp lệ");
    const [result] = await db.query("UPDATE fee_settings SET status = ? WHERE id = ?", [status, id]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy cấu hình phí");
    return success(res, "Cập nhật trạng thái phí thành công");
  } catch (err) { next(err); }
};

exports.deleteFeeSetting = async (req, res, next) => {
  try {
    const [result] = await db.query("DELETE FROM fee_settings WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy cấu hình phí");
    return success(res, "Xóa cấu hình phí thành công");
  } catch (err) { next(err); }
};