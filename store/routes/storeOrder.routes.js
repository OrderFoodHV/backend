const router = require("express").Router();
const storeOrder = require("../controllers/storeOrder.controller");

router.get("/:storeId/orders/stats", storeOrder.getOrderStats);
router.get("/:storeId/orders", storeOrder.getOrders);
router.get("/:storeId/orders/:orderId", storeOrder.getOrderDetail);
router.put("/:storeId/orders/:orderId/status", storeOrder.updateOrderStatus);

module.exports = router;
