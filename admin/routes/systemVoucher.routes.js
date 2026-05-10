const router = require("express").Router();
const systemVoucher = require("../controllers/systemVoucher.controller");

// Bảo vệ đã được áp dụng ở admin/routes/index.js (verifyToken + verifyAdmin)

router.get("/vouchers",               systemVoucher.getSystemVouchers);
router.get("/vouchers/stats",         systemVoucher.getVoucherStats);
router.post("/vouchers",              systemVoucher.createSystemVoucher);
router.put("/vouchers/:id",           systemVoucher.updateSystemVoucher);
router.delete("/vouchers/:id",        systemVoucher.deleteSystemVoucher);
router.post("/vouchers/:id/activate", systemVoucher.activateVoucher);
router.post("/vouchers/:id/deactivate", systemVoucher.deactivateVoucher);

module.exports = router;