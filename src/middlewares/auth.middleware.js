const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  // Lấy thẻ (token) từ header do Mobile/Front-end gửi lên
  const token = req.header("Authorization");

  // 🌟 BÙA CỨU NGUY DEMO 1: Nếu không có token, hoặc token bị dính chữ "undefined", "null" do reload app
  // Tự động kích hoạt chế độ Demo Bất Tử, bơm thẳng User mặc định để không bị lỗi 400/401
  if (!token || token.includes("undefined") || token.includes("null")) {
    console.log(
      "⚠️ [DEMO WARN] Phát hiện Token rỗng hoặc undefined! Kích hoạt chế độ Demo Bất Tử (User ID = 1)",
    );
    req.user = { id: 1, name: "Nguyễn Thị Thu Hoài", role: "merchant" };
    return next();
  }

  try {
    // Cắt bỏ chữ "Bearer " thường đi kèm với token
    const tokenParts = token.split(" ")[1] || token;

    const decoded = jwt.verify(tokenParts, process.env.JWT_SECRET || "secret");

    // Lấy id in chìm trong thẻ gán vào req.user để các hàm phía sau dùng
    req.user = decoded;

    // Thẻ thật -> Mở cửa cho đi tiếp vào controller
    next();
  } catch (err) {
    console.log("🚨 Lỗi giải mã Token thật:", err.message);

    // 🌟 BÙA CỨU NGUY DEMO 2: Đề phòng token thật bị hết hạn (Expired) lúc đang đứng trên bục thuyết trình
    // Không thèm trả về lỗi 400 nữa, bơm luôn User ID = 1 cho app chạy mượt mà thông suốt!
    console.log(
      "⚠️ Token hết hạn hoặc sai Key! Tự động bypass bơm User ID = 1 để cứu nguy.",
    );
    req.user = { id: 1, name: "Nguyễn Thị Thu Hoài", role: "merchant" };
    next();
  }
};
