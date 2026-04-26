const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  // Thêm 'name' vào đây
  const { name, email, password } = req.body;

  // Kiểm tra xem có gửi đủ data không
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng điền đủ tên, email và mật khẩu" });
  }

  const hash = await bcrypt.hash(password, 10);

  // Thêm 'name' vào câu lệnh SQL
  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hash],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Register success" });
    },
  );
};
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (!result.length) return res.status(404).json("Not found");

      const user = result[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) return res.status(400).json("Wrong password");

      const token = jwt.sign({ id: user.id }, "secret");

      res.json({ token });
    },
  );
};
