const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/add-review", verifyToken, reviewController.addReview);
router.get("/store/:storeId", reviewController.getStoreReviews);
router.get("/product/:productId", reviewController.getProductReviews);

module.exports = router;
