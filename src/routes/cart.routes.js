const router = require("express").Router();
const cart = require("../controllers/cart.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// TẤT CẢ api giỏ hàng đều phải đi qua bảo vệ (bắt buộc có thẻ Token)
router.post("/add", verifyToken, cart.addToCart);
router.get("/", verifyToken, cart.getCart);
router.delete("/clear", verifyToken, cart.clearCart);
router.delete("/remove", verifyToken, cart.removeFromCart);
router.put("/update", verifyToken, cart.updateCartItem);

module.exports = router;
