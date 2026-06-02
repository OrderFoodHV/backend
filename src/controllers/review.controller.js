const reviewService = require("../services/review.service");
const catchAsync = require("../utils/catchAsync");

exports.addReview = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Lấy từ middleware verifyToken bóc ra
  const reviewId = await reviewService.postReview(userId, req.body);

  res.status(201).json({
    status: "success",
    message: "Gửi đánh giá món ăn thành công!",
    review_id: reviewId,
  });
});

const db = require("../../config/db");

exports.getStoreReviews = catchAsync(async (req, res, next) => {
  const { storeId } = req.params;
  const reviews = await db("order_reviews as or")
    .leftJoin("users as u", "or.user_id", "u.id")
    .where("or.store_id", storeId)
    .select(
      "or.id",
      "or.order_id",
      "or.store_rating",
      "or.store_comment",
      "or.shipper_rating",
      "or.shipper_comment",
      "or.created_at",
      "u.name as user_name"
    )
    .orderBy("or.created_at", "desc");

  res.status(200).json({
    status: "success",
    data: reviews,
  });
});

exports.getProductReviews = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const reviews = await db("reviews as r")
    .leftJoin("users as u", "r.user_id", "u.id")
    .where("r.product_id", productId)
    .select(
      "r.id",
      "r.order_id",
      "r.rating",
      "r.comment",
      "r.created_at",
      "u.name as user_name"
    )
    .orderBy("r.created_at", "desc");

  res.status(200).json({
    status: "success",
    data: reviews,
  });
});
