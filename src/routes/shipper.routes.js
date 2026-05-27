// src/routes/shipper.routes.js
const router = require("express").Router();
const shipperController = require("../controllers/shipper.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { verifyShipper } = require("../middlewares/shipper.middleware");

router.get(
  "/orders",
  verifyToken,
  verifyShipper,
  shipperController.viewAvailableOrders,
);
router.patch(
  "/accept/:orderId",
  verifyToken,
  verifyShipper,
  shipperController.accept,
);
router.patch(
  "/complete/:orderId",
  verifyToken,
  verifyShipper,
  shipperController.complete,
);
router.post("/register", verifyToken, shipperController.registerShipper);
router.patch(
  "/status",
  verifyToken,
  verifyShipper,
  shipperController.updateStatus,
);
router.put(
  "/profile",
  verifyToken,
  verifyShipper,
  shipperController.updateProfile,
);
router.get(
  "/wallet",
  verifyToken,
  verifyShipper, // Bọc qua trạm gác này cho an toàn
  shipperController.getWallet,
);
module.exports = router;
