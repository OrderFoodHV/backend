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
