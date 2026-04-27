const router = require("express").Router();

const partnerRoutes = require("./partner.routes");
const accountStatusRoutes = require("./accountStatus.routes");
const categoryRoutes = require("./category.routes");
const feeRoutes = require("./fee.routes");
const disputeRoutes = require("./dispute.routes");
const systemVoucherRoutes = require("./systemVoucher.routes");

// Gộp tất cả routes admin
router.use("/", partnerRoutes);
router.use("/", accountStatusRoutes);
router.use("/", categoryRoutes);
router.use("/", feeRoutes);
router.use("/", disputeRoutes);
router.use("/", systemVoucherRoutes);

module.exports = router;