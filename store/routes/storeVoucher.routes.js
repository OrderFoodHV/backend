const router = require("express").Router({ mergeParams: true });
const { verifyStoreAccess } = require("../middlewares/store.middleware");
const storeVoucher = require("../controllers/storeVoucher.controller");

router.use(verifyStoreAccess);

router.get("/", storeVoucher.getVouchers);
router.post("/", storeVoucher.createVoucher);
router.put("/:voucherId/toggle", storeVoucher.toggleVoucher);
router.put("/:voucherId", storeVoucher.updateVoucher);
router.delete("/:voucherId", storeVoucher.deleteVoucher);

module.exports = router;
