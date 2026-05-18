const router = require("express").Router();
const storeVoucher = require("../controllers/storeVoucher.controller");

router.get("/:storeId/vouchers", storeVoucher.getVouchers);
router.post("/:storeId/vouchers", storeVoucher.createVoucher);
router.put("/:storeId/vouchers/:voucherId", storeVoucher.updateVoucher);
router.delete("/:storeId/vouchers/:voucherId", storeVoucher.deleteVoucher);
router.put("/:storeId/vouchers/:voucherId/toggle", storeVoucher.toggleVoucher);

module.exports = router;
