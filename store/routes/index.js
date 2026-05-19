const router = require("express").Router();
const { verifyToken } = require("../../src/middlewares/auth.middleware");
const {
  verifyStoreAccess,
} = require("../../store/middlewares/store.middleware");

const revenueRoutes = require("./revenue.routes");
const storeStatusRoutes = require("./storeStatus.routes");
const notificationRoutes = require("./notification.routes");
const storeOrderRoutes = require("./storeOrder.routes");
const storeProductRoutes = require("./storeProduct.routes");
const storeVoucherRoutes = require("./storeVoucher.routes");

// Tất cả API store đều yêu cầu đăng nhập
router.use(verifyToken);

// Middleware verifyStoreAccess đã được tích hợp vào từng sub-router

// Mount các route
router.use("/:storeId/revenue", revenueRoutes);
router.use("/:storeId/status", storeStatusRoutes);
router.use("/:storeId/notifications", notificationRoutes);
router.use("/:storeId/orders", storeOrderRoutes);
router.use("/:storeId/products", storeProductRoutes);
router.use("/:storeId/vouchers", storeVoucherRoutes);

module.exports = router;
