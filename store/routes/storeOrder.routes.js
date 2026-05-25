const router = require("express").Router({ mergeParams: true });
const { verifyStoreAccess } = require("../middlewares/store.middleware");
const storeOrderController = require("../controllers/storeOrder.controller");
router.use(verifyStoreAccess);

router.get("/", storeOrderController.getOrders);
router.get("/stats", storeOrderController.getOrderStats);
router.get("/:orderId", storeOrderController.getOrderDetail);
router.put("/:orderId/status", storeOrderController.updateOrderStatus);

module.exports = router;
