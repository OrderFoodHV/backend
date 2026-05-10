const router = require("express").Router();
const { verifyToken, verifyAdmin } = require("../../middlewares/auth.middleware");

const partnerRoutes       = require("./partner.routes");
const accountStatusRoutes = require("./accountStatus.routes");
const categoryRoutes      = require("./category.routes");
const feeRoutes           = require("./fee.routes");
const disputeRoutes       = require("./dispute.routes");
const systemVoucherRoutes = require("./systemVoucher.routes");

// Tất cả API admin đều phải qua xác thực token + quyền admin
router.use(verifyToken);
router.use(verifyAdmin);

router.use("/", partnerRoutes);
router.use("/", accountStatusRoutes);
router.use("/", categoryRoutes);
router.use("/", feeRoutes);
router.use("/", disputeRoutes);
router.use("/", systemVoucherRoutes);

module.exports = router;