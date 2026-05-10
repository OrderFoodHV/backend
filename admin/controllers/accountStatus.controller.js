const db = require("../../config/db");
const { ok, success, fail } = require("../../utils/response");

exports.getAccounts = async (req, res, next) => {
  try {
    const [results] = await db.query("SELECT id, name, email, phone, role, status, created_at FROM users ORDER BY created_at DESC");
    return ok(res, results);
  } catch (err) { next(err); }
};

exports.getAccountDetail = async (req, res, next) => {
  try {
    const [results] = await db.query("SELECT id, name, email, phone, role, status, created_at FROM users WHERE id = ?", [req.params.id]);
    if (results.length === 0) return fail(res, 404, "Không tìm thấy tài khoản");
    return ok(res, results[0]);
  } catch (err) { next(err); }
};

exports.updateAccountStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (parseInt(id) === req.user.id) return fail(res, 400, "Không thể thay đổi trạng thái tài khoản của chính mình!");
    if (!["active", "inactive", "banned"].includes(status)) return fail(res, 400, "Trạng thái không hợp lệ");
    const [result] = await db.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy tài khoản");
    return success(res, "Cập nhật trạng thái tài khoản thành công");
  } catch (err) { next(err); }
};

exports.banAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === req.user.id) return fail(res, 400, "Không thể tự khóa tài khoản của chính mình!");
    const [result] = await db.query("UPDATE users SET status = 'banned' WHERE id = ?", [id]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy tài khoản");
    return success(res, "Khóa tài khoản thành công");
  } catch (err) { next(err); }
};

exports.unbanAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("UPDATE users SET status = 'active' WHERE id = ?", [id]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy tài khoản");
    return success(res, "Mở khóa tài khoản thành công");
  } catch (err) { next(err); }
};