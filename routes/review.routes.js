const router = require("express").Router();
const review = require("../controllers/review.controller");

// Lấy tất cả đánh giá của một sản phẩm
router.get("/product/:productId", review.getByProduct);

// Lấy rating trung bình của sản phẩm
router.get("/product/:productId/rating", review.getProductRating);

// Lấy đánh giá của user cho một sản phẩm
router.get("/user/:userId/product/:productId", review.getUserReview);

// Tạo mới đánh giá
router.post("/", review.create);

// Cập nhật đánh giá
router.put("/:id", review.update);

// Xóa đánh giá
router.delete("/:id", review.delete);

module.exports = router;