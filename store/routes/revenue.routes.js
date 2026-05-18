const router = require("express").Router({ mergeParams: true });
const { verifyStoreAccess } = require("../middlewares/store.middleware");
const revenue = require("../controllers/revenue.controller");

router.use(verifyStoreAccess);

router.get("/summary", revenue.getSummary);
router.get("/chart", revenue.getChart);
router.get("/top-products", revenue.getTopProducts);

module.exports = router;
