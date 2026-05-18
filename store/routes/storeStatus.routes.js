const router = require("express").Router();
const storeStatus = require("../controllers/storeStatus.controller");

router.get("/:storeId/status", storeStatus.getStatus);
router.put("/:storeId/status/toggle", storeStatus.toggleStatus);

module.exports = router;
