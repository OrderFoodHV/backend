const router = require("express").Router();
const payment = require("../controllers/payment.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// tạo thanh toán
router.post("/create", verifyToken, payment.createPayment);

module.exports = router;
