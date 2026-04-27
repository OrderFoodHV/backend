const router = require("express").Router();
const dispute = require("../controllers/dispute.controller");
const verifyAdmin = require("../middlewares/admin.middleware");

// Tất cả routes đều cần xác thực admin
router.use(verifyAdmin);

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