const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ok, created, fail } = require("../utils/response");

// Đăng ký tài khoản mới
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return fail(res, 400, "Vui lòng điền đủ tên, email và mật khẩu");
    }
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return fail(res, 409, "Email này đã được sử dụng. Vui lòng chọn email khác!");
    }
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash]
    );
    return created(res, { id: result.insertId }, "Đăng ký thành công!");
  } catch (err) {
    next(err);
  }
};

// Đăng nhập
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return fail(res, 400, "Vui lòng nhập email và mật khẩu");
    }
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return fail(res, 404, "Email không tồn tại");
    }
    const user = rows[0];
    if (user.status === "banned") {
      return fail(res, 403, "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return fail(res, 400, "Mật khẩu không đúng");
    }
    const token = jwt.sign(
      { id: user.id, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    return ok(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }, "Đăng nhập thành công!");
  } catch (err) {
    next(err);
  }
};
