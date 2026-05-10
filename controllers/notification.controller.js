const db = require("../config/db");
const { ok, created, success, fail } = require("../utils/response");

exports.getAll = async (req, res, next) => {
  try {
    const [data] = await db.query("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC", [req.user.id]);
    return ok(res, data);
  } catch (err) { next(err); }
};

exports.getUnread = async (req, res, next) => {
  try {
    const [data] = await db.query("SELECT * FROM notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC", [req.user.id]);
    return ok(res, data);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { user_id, title, message, type } = req.body;
    if (!user_id || !title || !message) return fail(res, 400, "Thiếu thông tin bắt buộc (user_id, title, message)");
    const [result] = await db.query(
      "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
      [user_id, title, message, type || "general"]
    );
    return created(res, { id: result.insertId }, "Tạo thông báo thành công");
  } catch (err) { next(err); }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const [result] = await db.query(
      "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?",
      [req.params.notificationId, req.user.id]
    );
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy thông báo");
    return success(res, "Đánh dấu đã đọc thành công");
  } catch (err) { next(err); }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await db.query("UPDATE notifications SET is_read = 1 WHERE user_id = ?", [req.user.id]);
    return success(res, "Đánh dấu tất cả đã đọc thành công");
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const [result] = await db.query(
      "DELETE FROM notifications WHERE id = ? AND user_id = ?",
      [req.params.notificationId, req.user.id]
    );
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy thông báo");
    return success(res, "Xóa thông báo thành công");
  } catch (err) { next(err); }
};