const express = require("express");
const router = express.Router();
const favorite = require("../controllers/favorite.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Yêu cầu đăng nhập cho tất cả các API favorite
router.use(verifyToken);

// Lấy danh sách yêu thích
router.get("/", favorite.getFavorites);

// Thêm vào danh sách yêu thích
router.post("/add", favorite.addFavorite);

// Xóa khỏi danh sách yêu thích
router.delete("/remove/:productId", favorite.removeFavorite);

// Kiểm tra xem sản phẩm có trong danh sách yêu thích không
router.get("/check/:productId", favorite.checkFavorite);

module.exports = router;
