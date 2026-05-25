// src/repositories/review.repository.js
const db = require("../../config/db");

exports.createReviewTransaction = async (
  userId,
  productId,
  orderId,
  stars,
  comment,
) => {
  // Sửa: Khớp đúng tên cột 'rating' và 'comment' trong schema.sql
  const [insertId] = await db("reviews").insert({
    user_id: userId,
    product_id: productId,
    order_id: orderId,
    rating: stars,
    comment: comment,
  });
  return insertId;
};
