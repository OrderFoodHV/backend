// src/middlewares/shipper.middleware.js
exports.verifyShipper = (req, res, next) => {
  // Cho phép vào nếu role là shipper HOẶC cờ is_shipper được bật lên 1
  if (req.user.is_shipper === 1 || req.user.role === "shipper") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Tài khoản chưa kích hoạt quyền tài xế!",
  });
};
