// GET all users
exports.getUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

// CREATE user
const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const { user_name, email, password } = req.body;
  const name = user_name;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        // Bắt riêng lỗi trùng email (ER_DUP_ENTRY)
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "Email này đã được sử dụng. Vui lòng chọn email khác!",
          });
        }
        // Nếu là lỗi khác thì vẫn trả về 500
        return res.status(500).json({ message: "Lỗi Server", error: err });
      }
      res.json({ message: "User created", id: result.insertId });
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    res.json({
      success: true,
      message: "Login thành công",
      user_name: user.name,
      email: user.email,
      token: "fake-token", // tạm thời
    });
  });
};
