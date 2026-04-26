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
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        // Bắt riêng lỗi trùng email (ER_DUP_ENTRY)
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({
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
