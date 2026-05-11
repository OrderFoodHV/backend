const router = require("express").Router();
const payment = require("../controllers/payment.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/process", verifyToken, payment.pay);

module.exports = router;
