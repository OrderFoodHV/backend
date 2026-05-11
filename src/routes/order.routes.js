const router = require("express").Router();
const order = require("../controllers/order.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Khách muốn mua phải có Token
router.post("/create", verifyToken, order.createOrder);

module.exports = router;
