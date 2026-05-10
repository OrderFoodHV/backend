const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Từ chối truy cập! Yêu cầu có token." });
  }

  // Hỗ trợ cả "Bearer <token>" lẫn token thuần
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "food_app_super_secret_key_2025_change_in_production");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Từ chối truy cập! Chỉ dành cho Admin." });
  }
  next();
};
