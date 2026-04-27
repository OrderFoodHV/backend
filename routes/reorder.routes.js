const router = require("express").Router();
const reorder = require("../controllers/reorder.controller");

// Lấy danh sách đơn có thể đặt lại
router.get("/reorderable/:userId", reorder.getReorderableOrders);

// Lấy chi tiết đơn cũ để xem trước khi đặt lại
router.get("/details/:userId/:orderId", reorder.getOrderDetails);

// Đặt lại toàn bộ đơn hàng
router.post("/", reorder.reorder);

// Đặt lại một sản phẩm từ đơn cũ
router.post("/single", reorder.reorderSingleItem);

module.exports = router;