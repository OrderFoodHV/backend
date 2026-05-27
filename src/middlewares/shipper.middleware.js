// src/middlewares/shipper.middleware.js
const db = require("../../config/db");

exports.verifyShipper = async (req, res, next) => {
  try {
    const [users] = await db.query("SELECT is_shipper, role FROM users WHERE id = ?", [req.user.id]);
    if (users && users.length > 0) {
      const dbUser = users[0];
      if (dbUser.is_shipper === 1 || dbUser.role === "shipper") {
        return next();
      }
    }
    return res.status(403).json({
      success: false,
      message: "Tài khoản chưa kích hoạt quyền tài xế!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Lỗi xác thực quyền tài xế!",
    });
  }
};
