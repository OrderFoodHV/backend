const router = require("express").Router();
const tracking = require("../controllers/ordertracking.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Xem lịch sử tất cả đơn
router.get("/history", verifyToken, tracking.getHistory);

// Xem chi tiết 1 đơn (Truyền ID vào URL)
router.get("/:orderId", verifyToken, tracking.getDetails);

// Shipper cập nhật trạng thái đơn
router.patch("/:orderId/status", verifyToken, tracking.updateStatus);

module.exports = router;
