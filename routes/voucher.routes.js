const router = require("express").Router();
const voucher = require("../controllers/voucher.controller");

router.get("/", voucher.getAll);
router.get("/:code", voucher.getByCode);
router.post("/", voucher.create);
router.post("/use", voucher.useVoucher);

module.exports = router;