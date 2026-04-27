const router = require("express").Router();
const systemVoucher = require("../controllers/systemVoucher.controller");
const verifyAdmin = require("../middlewares/admin.middleware");

// Tất cả routes đều cần xác thực admin
router.use(verifyAdmin);

// Quản lý Voucher hệ thống
router.get("/vouchers", systemVoucher.getSystemVouchers);
router.get("/vouchers/stats", systemVoucher.getVoucherStats);
router.post("/vouchers", systemVoucher.createSystemVoucher);
router.put("/vouchers/:id", systemVoucher.updateSystemVoucher);
router.delete("/vouchers/:id", systemVoucher.deleteSystemVoucher);
router.put("/vouchers/:id/status", systemVoucher.updateVoucherStatus);
router.post("/vouchers/:id/activate", systemVoucher.activateVoucher);
router.post("/vouchers/:id/deactivate", systemVoucher.deactivateVoucher);

module.exports = router;