const jwt = require("jsonwebtoken");

// Middleware xác thực admin
const verifyAdmin = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Không có token xác thực" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "secret_key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token không hợp lệ" });
    }

    // Kiểm tra role admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    req.admin = decoded;
    next();
  });
};

module.exports = verifyAdmin;