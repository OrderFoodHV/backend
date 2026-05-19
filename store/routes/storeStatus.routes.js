const router = require("express").Router({ mergeParams: true });
const { verifyStoreAccess } = require("../middlewares/store.middleware");
const storeStatus = require("../controllers/storeStatus.controller");

console.log("verifyStoreAccess TYPE:", typeof verifyStoreAccess);

router.use(verifyStoreAccess);

router.get("/", storeStatus.getStatus);
router.put("/toggle", storeStatus.toggleStatus);

module.exports = router;
