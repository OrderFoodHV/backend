const adminService = require("../services/admin.service");
const catchAsync = require("../utils/catchAsync");

exports.getDashboardStats = catchAsync(async (req, res) => {
  // Check quyền Admin ở Middleware (sẽ hướng dẫn bên dưới)
  const stats = await adminService.getStats();
  res.status(200).json({ status: "success", data: stats });
});

exports.updateFeeSettings = catchAsync(async (req, res) => {
  const { fee_type, fee_value } = req.body;
  await adminService.updateFee(fee_type, fee_value);
  res
    .status(200)
    .json({ status: "success", message: "Đã cập nhật phí hệ thống!" });
});

exports.getAllDisputes = catchAsync(async (req, res) => {
  const disputes = await adminService.getDisputes();
  res.status(200).json({ status: "success", data: disputes });
});
