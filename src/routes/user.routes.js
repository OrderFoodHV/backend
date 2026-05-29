const router = require("express").Router();
const user = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Xem profile của mình
router.get("/me", verifyToken, user.getMe);

// Cập nhật profile của mình
router.patch("/update-me", verifyToken, user.updateMe);
// Cổng API xóa vĩnh viễn tài khoản đăng nhập
router.delete("/delete-account", verifyToken, user.deleteMe);

// Quản lý địa chỉ giao hàng
router.get("/addresses", verifyToken, user.getAddresses);
router.post("/addresses", verifyToken, user.addAddress);
router.put("/addresses/:id", verifyToken, user.updateAddress);
router.put("/addresses/:id/default", verifyToken, user.setDefaultAddress);

// Quản lý sản phẩm yêu thích
router.get("/favorites", verifyToken, user.getFavorites);
router.post("/favorites", verifyToken, user.addFavorite);
router.delete("/favorites/:productId", verifyToken, user.removeFavorite);

module.exports = router;
