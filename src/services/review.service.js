const reviewRepo = require("../repositories/review.repository");

exports.postReview = async (userId, reviewData) => {
  const { product_id, order_id, rating_stars, comment_text } = reviewData;

  if (rating_stars < 1 || rating_stars > 5) {
    throw new Error("Số sao đánh giá phải từ 1 đến 5 sếp nhen!");
  }

  return await reviewRepo.createReviewTransaction(
    userId,
    product_id,
    order_id,
    rating_stars,
    comment_text,
  );
};
