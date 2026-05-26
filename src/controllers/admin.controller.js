const adminService = require("../services/admin.service");
const catchAsync = require("../utils/catchAsync");
const { ok, fail } = require("../utils/response");

// ── Dashboard ──
exports.getDashboardStats = catchAsync(async (req, res) => {
  const stats = await adminService.getStats();
  return ok(res, stats);
});

// ── Accounts ──
exports.getAccounts = catchAsync(async (req, res) => {
  const accounts = await adminService.getAllAccounts();
  return ok(res, accounts);
});

exports.getAccountById = catchAsync(async (req, res) => {
  const account = await adminService.getAccountById(req.params.id);
  if (!account) return fail(res, 404, "Không tìm thấy tài khoản!");
  return ok(res, account);
});

exports.setAccountStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  await adminService.setAccountStatus(req.params.id, status);
  return ok(res, null, "Đã cập nhật trạng thái tài khoản!");
});

exports.banAccount = catchAsync(async (req, res) => {
  await adminService.setAccountStatus(req.params.id, "banned");
  return ok(res, null, "Đã khóa tài khoản!");
});

exports.unbanAccount = catchAsync(async (req, res) => {
  await adminService.setAccountStatus(req.params.id, "active");
  return ok(res, null, "Đã mở khóa tài khoản!");
});

// ── Partners ──
exports.getPartners = catchAsync(async (req, res) => {
  const partners = await adminService.getAllPartners();
  return ok(res, partners);
});

exports.updatePartner = catchAsync(async (req, res) => {
  await adminService.updatePartner(req.params.id, req.body);
  return ok(res, null, "Đã cập nhật đối tác!");
});

exports.deletePartner = catchAsync(async (req, res) => {
  await adminService.deletePartner(req.params.id);
  return ok(res, null, "Đã xóa đối tác!");
});

exports.approvePartner = catchAsync(async (req, res) => {
  await adminService.setPartnerStatus(req.params.id, "active");
  return ok(res, null, "Đã duyệt đối tác!");
});

// ── Categories ──
exports.getCategories = catchAsync(async (req, res) => {
  const categories = await adminService.getAllCategories();
  return ok(res, categories);
});

exports.createCategory = catchAsync(async (req, res) => {
  const id = await adminService.createCategory(req.body);
  return ok(res, { id }, "Đã tạo danh mục mới!");
});

exports.updateCategory = catchAsync(async (req, res) => {
  await adminService.updateCategory(req.params.id, req.body);
  return ok(res, null, "Đã cập nhật danh mục!");
});

exports.deleteCategory = catchAsync(async (req, res) => {
  await adminService.deleteCategory(req.params.id);
  return ok(res, null, "Đã xóa danh mục!");
});

exports.setCategoryStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  await adminService.setCategoryStatus(req.params.id, status);
  return ok(res, null, "Đã cập nhật trạng thái danh mục!");
});

// ── Fees ──
exports.getFees = catchAsync(async (req, res) => {
  const fees = await adminService.getAllFees();
  return ok(res, fees);
});

exports.updateServiceFee = catchAsync(async (req, res) => {
  await adminService.updateFeeByType("service", req.body);
  return ok(res, null, "Đã cập nhật phí dịch vụ!");
});

exports.updateShippingFee = catchAsync(async (req, res) => {
  await adminService.updateFeeByType("shipping", req.body);
  return ok(res, null, "Đã cập nhật phí giao hàng!");
});

exports.createFee = catchAsync(async (req, res) => {
  const id = await adminService.createFee(req.body);
  return ok(res, { id }, "Đã tạo cấu hình phí mới!");
});

exports.setFeeStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  await adminService.setFeeStatus(req.params.id, status);
  return ok(res, null, "Đã cập nhật trạng thái phí!");
});

exports.deleteFee = catchAsync(async (req, res) => {
  await adminService.deleteFee(req.params.id);
  return ok(res, null, "Đã xóa cấu hình phí!");
});

// Backward compat
exports.updateFeeSettings = catchAsync(async (req, res) => {
  const { fee_type, fee_value } = req.body;
  await adminService.updateFee(fee_type, fee_value);
  return ok(res, null, "Đã cập nhật phí hệ thống!");
});

// ── Disputes ──
exports.getDisputes = catchAsync(async (req, res) => {
  const disputes = await adminService.getAllDisputes();
  return ok(res, disputes);
});

exports.getDisputeById = catchAsync(async (req, res) => {
  const dispute = await adminService.getDisputeById(req.params.id);
  if (!dispute) return fail(res, 404, "Không tìm thấy tranh chấp!");
  return ok(res, dispute);
});

exports.resolveDispute = catchAsync(async (req, res) => {
  await adminService.resolveDispute(req.params.id, req.body);
  return ok(res, null, "Đã giải quyết tranh chấp!");
});

exports.refundDispute = catchAsync(async (req, res) => {
  const { refund_amount } = req.body;
  await adminService.refundDispute(req.params.id, refund_amount);
  return ok(res, null, "Đã xử lý hoàn tiền cho tranh chấp!");
});

exports.rejectDispute = catchAsync(async (req, res) => {
  const { reason } = req.body;
  await adminService.rejectDispute(req.params.id, reason);
  return ok(res, null, "Đã từ chối tranh chấp!");
});

// ── Refunds ──
exports.getRefunds = catchAsync(async (req, res) => {
  const refunds = await adminService.getAllRefunds();
  return ok(res, refunds);
});

exports.approveRefund = catchAsync(async (req, res) => {
  await adminService.approveRefund(req.params.id);
  return ok(res, null, "Đã duyệt hoàn tiền!");
});

// ── Vouchers ──
exports.getVouchers = catchAsync(async (req, res) => {
  const vouchers = await adminService.getAllVouchers();
  return ok(res, vouchers);
});

exports.getVoucherStats = catchAsync(async (req, res) => {
  const stats = await adminService.getVoucherStats();
  return ok(res, stats);
});

exports.createVoucher = catchAsync(async (req, res) => {
  const id = await adminService.createVoucher(req.body);
  return ok(res, { id }, "Đã tạo voucher mới!");
});

exports.updateVoucher = catchAsync(async (req, res) => {
  await adminService.updateVoucher(req.params.id, req.body);
  return ok(res, null, "Đã cập nhật voucher!");
});

exports.deleteVoucher = catchAsync(async (req, res) => {
  await adminService.deleteVoucher(req.params.id);
  return ok(res, null, "Đã xóa voucher!");
});

exports.activateVoucher = catchAsync(async (req, res) => {
  await adminService.setVoucherStatus(req.params.id, 1);
  return ok(res, null, "Đã kích hoạt voucher!");
});

exports.deactivateVoucher = catchAsync(async (req, res) => {
  await adminService.setVoucherStatus(req.params.id, 0);
  return ok(res, null, "Đã tắt voucher!");
});
