const router = require("express").Router();
const cancel = require("../controllers/cancel.controller");

// Lấy danh sách đơn có thể hủy
router.get("/cancellable/:userId", cancel.getCancellableOrders);

// Lấy danh sách đơn đã hủy
router.get("/cancelled/:userId", cancel.getCancelledOrders);

// User hủy đơn của mình
router.post("/order/:orderId", cancel.cancelOrder);

// Admin hủy đơn của user khác
router.post("/admin/order/:orderId", cancel.adminCancelOrder);

module.exports = router;