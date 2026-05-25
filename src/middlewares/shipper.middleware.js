// src/middlewares/shipper.middleware.js
exports.verifyShipper = (req, res, next) => {
  console.log("🔍 USER TRONG REQUEST:", req.user);
  // Giả định req.user đã được gán bởi verifyToken trước đó
  if (req.user && req.user.is_shipper === 1) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền truy cập kênh Tài xế!",
    });
  }
};
