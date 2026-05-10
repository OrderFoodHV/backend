const router = require("express").Router();
const dispute = require("../controllers/dispute.controller");

// Bảo vệ đã được áp dụng ở admin/routes/index.js

// Giải quyết tranh chấp/Hoàn tiền
router.get("/disputes", dispute.getDisputes);
router.get("/disputes/:id", dispute.getDisputeDetail);
router.put("/disputes/:id/resolve", dispute.resolveDispute);
router.post("/disputes/:id/refund", dispute.processRefund);
router.post("/disputes/:id/reject", dispute.rejectDispute);

// Yêu cầu hoàn tiền
router.get("/refunds", dispute.getRefundRequests);
router.post("/refunds/:id/approve", dispute.approveRefund);

module.exports = router;