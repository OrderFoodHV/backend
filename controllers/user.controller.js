const db = require("../config/db");
const bcrypt = require("bcrypt");
const { ok, created, success, fail } = require("../utils/response");

// Lấy tất cả users
exports.getUsers = async (req, res, next) => {
  try {
    const [result] = await db.query(
      "SELECT id, name, email, phone, role, status, created_at FROM users ORDER BY created_at DESC"
    );
    return ok(res, result);
  } catch (err) { next(err); }
};

// Tạo user mới
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return fail(res, 400, "Vui lòng điền đủ thông tin");
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    return created(res, { id: result.insertId }, "Tạo user thành công");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return fail(res, 409, "Email này đã được sử dụng!");
    next(err);
  }
};

// Lấy thông tin profile của user hiện tại (từ token)
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      "SELECT id, name, email, phone, role, status, created_at FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0) return fail(res, 404, "Không tìm thấy người dùng");
    return ok(res, rows[0]);
  } catch (err) { next(err); }
};

// Cập nhật thông tin profile
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;
    await db.query(
      "UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?",
      [name, phone, userId]
    );
    return success(res, "Cập nhật thông tin thành công");
  } catch (err) { next(err); }
};
