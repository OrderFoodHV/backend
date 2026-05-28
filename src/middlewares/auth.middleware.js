const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token || token.includes("undefined") || token.includes("null")) {
    return res.status(401).json({
      status: "fail",
      message: "Vui lòng đăng nhập lại!",
      success: false
    });
  }

  try {
    const tokenParts = token.split(" ")[1] || token;
    const decoded = jwt.verify(tokenParts, process.env.JWT_SECRET || "secret");

    // Kiểm tra xem tài khoản có bị khóa trong database không
    const db = require("../../config/db");
    const [users] = await db.query("SELECT status FROM users WHERE id = ?", [decoded.id]);
    if (users && users.length > 0 && users[0].status !== "active") {
      return res.status(403).json({
        status: "fail",
        message: "Tài khoản của sếp đã bị khóa hoặc ngừng hoạt động!",
        success: false
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.log("🚨 Lỗi giải mã Token thật:", err.message);
    return res.status(401).json({
      status: "fail",
      message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!",
      success: false
    });
  }
};
