const router = require("express").Router();
const notification = require("../controllers/notification.controller");

router.get("/:storeId/notifications/stream", notification.streamNewOrders);
router.get("/:storeId/notifications/recent", notification.getRecentOrders);

module.exports = router;
