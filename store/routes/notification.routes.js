const router = require("express").Router({ mergeParams: true });
const { verifyStoreAccess } = require("../middlewares/store.middleware");
const notification = require("../controllers/notification.controller");

router.use(verifyStoreAccess);

router.get("/stream", notification.streamNewOrders);
router.get("/recent", notification.getRecentOrders);

module.exports = router;
