const router = require("express").Router();
const fee = require("../controllers/fee.controller");

// Bảo vệ đã được áp dụng ở admin/routes/index.js

// Quản lý phí dịch vụ & Phí vận chuyển
router.get("/fees", fee.getFeeSettings);
router.post("/fees", fee.createFeeSetting);
router.put("/fees/service", fee.updateServiceFee);
router.put("/fees/shipping", fee.updateShippingFee);
router.put("/fees/:id/status", fee.updateFeeStatus);
router.delete("/fees/:id", fee.deleteFeeSetting);

module.exports = router;