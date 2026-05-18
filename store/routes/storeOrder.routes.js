const router = require("express").Router({ mergeParams: true });
const { verifyStoreAccess } = require("../middlewares/store.middleware");
const storeOrder = require("../controllers/storeOrder.controller");

router.use(verifyStoreAccess);

router.get("/", storeOrder.getOrders);
router.get("/stats", storeOrder.getOrderStats);
router.get("/:orderId", storeOrder.getOrderDetail);
router.put("/:orderId/status", storeOrder.updateOrderStatus);

module.exports = router;
