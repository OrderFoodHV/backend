const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  const token = req.header("Authorization");

  // BÙA CỨU NGUY DEMO: Nếu không có token hoặc dính chuỗi rỗng do reload app
  if (!token || token.includes("undefined") || token.includes("null")) {
    console.log("⚠️ [DEMO WARN] Kích hoạt chế độ Demo Bất Tử (User ID = 1)");
    req.user = { id: 1, name: "Nguyễn Thị Thu Hoài", role: "admin" }; // Đổi thành admin để test được cả web admin
    return next();
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
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.log("🚨 Lỗi giải mã Token thật:", err.message);
    // Hết hạn token khi đang thuyết trình -> Tự động bypass cứu nguy
    req.user = { id: 1, name: "Nguyễn Thị Thu Hoài", role: "admin" };
    next();
  }
};
