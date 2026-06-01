const router = require("express").Router();
const payment = require("../controllers/payment.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { verifyHmacSignature } = require("../middlewares/hmac.middleware");

router.post("/process", verifyToken, verifyHmacSignature, payment.pay);
router.post("/mock-verify", verifyToken, payment.verifyMockPayment);

// VNPay Routes
router.post("/vnpay/create_url", verifyToken, payment.createVnpayUrl);
router.get("/vnpay_return", payment.vnpayReturn);
router.get("/vnpay_ipn", payment.vnpayIpn);

module.exports = router;
