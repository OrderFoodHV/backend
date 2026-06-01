const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucher.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/check", verifyToken, voucherController.checkVoucher);
router.get("/system", verifyToken, voucherController.getSystemVouchers);
router.get("/store/:storeId", verifyToken, voucherController.getStoreVouchers);

module.exports = router;
