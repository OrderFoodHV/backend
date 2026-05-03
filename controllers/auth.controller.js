const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng điền đủ tên, email và mật khẩu" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Register success" });
      },
    );
  } catch (error) {
    return res.status(500).json({ message: "Lỗi mã hóa mật khẩu" });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);
      if (!result.length) return res.status(404).json({ message: "Not found" });

      const user = result[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) return res.status(400).json({ message: "Wrong password" });

      // ✅ BƯỚC 1: Tạo Access Token (sống 1 giờ)
      const accessToken = jwt.sign({ id: user.id, role: user.role }, "secret", {
        expiresIn: "1h",
      });

      // ✅ BƯỚC 2: Tạo Refresh Token (sống 30 ngày)
      const refreshToken = jwt.sign({ id: user.id }, "refresh_secret", {
        expiresIn: "30d",
      });

      // ✅ BƯỚC 3: Lưu Refresh Token vào Database
      db.query(
        "UPDATE users SET refresh_token = ? WHERE id = ?",
        [refreshToken, user.id],
        (updateErr) => {
          if (updateErr) return res.status(500).json(updateErr);

          // ✅ BƯỚC 4: Trả cả 2 token về cho FE
          res.json({
            message: "Đăng nhập thành công",
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        },
      );
    },
  );
};

// API cấp lại Access Token mới
exports.refreshToken = (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(401).json({ message: "Thiếu Refresh Token!" });
  }

  // 1. Kiểm tra xem token này có trong Database không
  db.query(
    "SELECT id, role FROM users WHERE refresh_token = ?",
    [refresh_token],
    (err, users) => {
      if (err) return res.status(500).json(err);

      if (users.length === 0) {
        return res
          .status(403)
          .json({ message: "Refresh Token không hợp lệ hoặc đã bị thu hồi!" });
      }

      const user = users[0];

      // 2. Dùng JWT để check xem Refresh Token còn hạn không
      jwt.verify(refresh_token, "refresh_secret", (verifyErr, decoded) => {
        if (verifyErr) {
          return res
            .status(403)
            .json({
              message: "Refresh Token đã hết hạn, vui lòng đăng nhập lại!",
            });
        }

        // 3. Cấp Access Token mới (sống thêm 1h nữa)
        const newAccessToken = jwt.sign(
          { id: user.id, role: user.role },
          "secret",
          { expiresIn: "1h" },
        );

        res.json({
          message: "Làm mới Token thành công!",
          access_token: newAccessToken,
        });
      });
    },
  );
};
