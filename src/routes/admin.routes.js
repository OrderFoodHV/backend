const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Chỉ Admin mới được vào các link này
router.get("/dashboard", verifyToken, adminController.getDashboardStats);
router.patch("/fee-settings", verifyToken, adminController.updateFeeSettings);
router.get("/disputes", verifyToken, adminController.getAllDisputes);

module.exports = router;
