const router = require("express").Router();
const cart = require("../controllers/cart.controller");
// Nhúng anh bảo vệ vào
const { verifyToken } = require("../middlewares/auth.middleware");

// Gắn verifyToken vào TẤT CẢ các API của giỏ hàng
router.get("/", verifyToken, cart.getCart); // Bỏ /:user_id đi vì đã có Token
router.post("/add", verifyToken, cart.addToCart);
router.put("/update", verifyToken, cart.updateCartItem);
router.delete("/remove", verifyToken, cart.removeFromCart);

module.exports = router;
