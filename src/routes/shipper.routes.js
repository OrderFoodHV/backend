const router = require("express").Router();
const shipper = require("../controllers/shipper.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Xem đơn nhàn rỗi
router.get("/orders/available", verifyToken, shipper.viewAvailableOrders);

// Nhận đơn (Bấm Nhận cuốc)
router.post("/orders/:orderId/accept", verifyToken, shipper.accept);

// Hoàn thành đơn
router.post("/orders/:orderId/complete", verifyToken, shipper.complete);

module.exports = router;
