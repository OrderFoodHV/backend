const router = require("express").Router();
const { verifyToken } = require("../../middlewares/auth.middleware");
const { verifyStoreAccess } = require("../middlewares/store.middleware");

const revenueRoutes      = require("./revenue.routes");
const storeStatusRoutes  = require("./storeStatus.routes");
const notificationRoutes = require("./notification.routes");
const storeOrderRoutes   = require("./storeOrder.routes");
const storeProductRoutes = require("./storeProduct.routes");
const storeVoucherRoutes = require("./storeVoucher.routes");

// Tất cả API store đều yêu cầu đăng nhập
router.use(verifyToken);

// Middleware kiểm tra quyền truy cập store cho tất cả route có :storeId
router.param("storeId", async (req, res, next, storeId) => {
  req.params.storeId = storeId;
  await verifyStoreAccess(req, res, next);
});

// Mount các route
router.use("/", revenueRoutes);
router.use("/", storeStatusRoutes);
router.use("/", notificationRoutes);
router.use("/", storeOrderRoutes);
router.use("/", storeProductRoutes);
router.use("/", storeVoucherRoutes);

module.exports = router;
