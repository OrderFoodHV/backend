const router = require("express").Router();
const cart = require("../controllers/cart.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// TẤT CẢ api giỏ hàng đều phải đi qua bảo vệ (bắt buộc có thẻ Token)
router.post("/add", verifyToken, cart.addToCart);
router.get("/", verifyToken, cart.getCart);

module.exports = router;
