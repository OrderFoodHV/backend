const router = require("express").Router();
const revenue = require("../controllers/revenue.controller");

router.get("/:storeId/revenue/summary", revenue.getSummary);
router.get("/:storeId/revenue/chart", revenue.getChart);
router.get("/:storeId/revenue/top-products", revenue.getTopProducts);

module.exports = router;
