const router = require("express").Router();
const reward = require("../controllers/reward.controller");

router.get("/:userId", reward.getUserPoints);
router.get("/history/:userId", reward.getPointHistory);
router.post("/add", reward.addPoints);
router.post("/redeem", reward.redeemPoints);

module.exports = router;