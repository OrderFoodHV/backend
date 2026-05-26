const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");

// Tất cả admin routes đều yêu cầu đăng nhập VÀ có quyền admin
const auth = [verifyToken, isAdmin];

// ── Dashboard ──
router.get("/dashboard", auth, adminController.getDashboardStats);

// ── Accounts (Quản lý tài khoản) ──
router.get("/accounts",             auth, adminController.getAccounts);
router.get("/accounts/:id",         auth, adminController.getAccountById);
router.put("/accounts/:id/status",  auth, adminController.setAccountStatus);
router.post("/accounts/:id/ban",    auth, adminController.banAccount);
router.post("/accounts/:id/unban",  auth, adminController.unbanAccount);

// ── Partners (Đối tác / Cửa hàng) ──
router.get("/partners",             auth, adminController.getPartners);
router.put("/partners/:id",         auth, adminController.updatePartner);
router.delete("/partners/:id",      auth, adminController.deletePartner);
router.post("/partners/:id/approve",auth, adminController.approvePartner);

// ── Categories (Danh mục) ──
router.get("/categories",              auth, adminController.getCategories);
router.post("/categories",             auth, adminController.createCategory);
router.put("/categories/:id",          auth, adminController.updateCategory);
router.delete("/categories/:id",       auth, adminController.deleteCategory);
router.put("/categories/:id/status",   auth, adminController.setCategoryStatus);

// ── Fees (Cấu hình phí) ──
router.get("/fees",                 auth, adminController.getFees);
router.put("/fees/service",         auth, adminController.updateServiceFee);
router.put("/fees/shipping",        auth, adminController.updateShippingFee);
router.post("/fees",                auth, adminController.createFee);
router.put("/fees/:id/status",      auth, adminController.setFeeStatus);
router.delete("/fees/:id",          auth, adminController.deleteFee);
// Giữ backward compat với route cũ
router.patch("/fee-settings",       auth, adminController.updateFeeSettings);

// ── Disputes (Tranh chấp) ──
router.get("/disputes",               auth, adminController.getDisputes);
router.get("/disputes/:id",           auth, adminController.getDisputeById);
router.put("/disputes/:id/resolve",   auth, adminController.resolveDispute);
router.post("/disputes/:id/refund",   auth, adminController.refundDispute);
router.post("/disputes/:id/reject",   auth, adminController.rejectDispute);

// ── Refunds (Hoàn tiền) ──
router.get("/refunds",               auth, adminController.getRefunds);
router.post("/refunds/:id/approve",  auth, adminController.approveRefund);

// ── Vouchers ──
router.get("/vouchers",                  auth, adminController.getVouchers);
router.get("/vouchers/stats",            auth, adminController.getVoucherStats);
router.post("/vouchers",                 auth, adminController.createVoucher);
router.put("/vouchers/:id",              auth, adminController.updateVoucher);
router.delete("/vouchers/:id",           auth, adminController.deleteVoucher);
router.post("/vouchers/:id/activate",    auth, adminController.activateVoucher);
router.post("/vouchers/:id/deactivate",  auth, adminController.deactivateVoucher);

module.exports = router;
