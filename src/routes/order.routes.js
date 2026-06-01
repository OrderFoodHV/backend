// src/routes/order.routes.js
const router = require("express").Router();
const orderController = require("../controllers/order.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Khách muốn mua phải có Token
router.post("/create", verifyToken, orderController.createOrder);

// Cổng xem lịch sử đơn hàng (Đã có handler hợp lệ bên Controller)
router.get("/history", verifyToken, orderController.getHistory);

// Đặt lại đơn hàng cũ
router.post("/:id/reorder", verifyToken, orderController.reorder);

// Đánh giá đơn hàng
router.post("/:id/reviews", verifyToken, orderController.submitOrderReview);

module.exports = router;
