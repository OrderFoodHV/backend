const router = require("express").Router();
const payment = require("../controllers/payment.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Cần đăng nhập mới tạo được link thanh toán
router.post("/create_url", verifyToken, payment.createPaymentUrl);

// Thằng VNPay nó sẽ gọi thẳng vào link này (Không để verifyToken ở đây nhé)
router.get("/vnpay_return", payment.vnpayReturn);

module.exports = router;
