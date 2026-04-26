const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  // Lấy thẻ (token) từ header do Mobile/Front-end gửi lên
  const token = req.header("Authorization");

  // Nếu không có thẻ -> Đuổi ra
  if (!token) {
    return res
      .status(401)
      .json({ message: "Từ chối truy cập! Yêu cầu có token." });
  }

  try {
    // Dùng máy quét (secret key) để giải mã thẻ
    // Cắt bỏ chữ "Bearer " thường đi kèm với token
    const tokenParts = token.split(" ")[1] || token;

    const decoded = jwt.verify(tokenParts, "secret"); // "secret" phải giống lúc login

    // Lấy id in chìm trong thẻ gán vào req.user để các hàm phía sau dùng
    req.user = decoded;

    // Thẻ thật -> Mở cửa cho đi tiếp vào controller
    next();
  } catch (err) {
    res.status(400).json({ message: "Token không hợp lệ!" });
  }
};
