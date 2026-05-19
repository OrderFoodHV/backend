const db = require("../../config/db");

exports.createReviewTransaction = async (
  userId,
  productId,
  orderId,
  stars,
  comment,
) => {
  const query = `
    INSERT INTO reviews (user_id, product_id, order_id, rating_stars, comment_text, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
  const [result] = await db.query(query, [
    userId,
    productId,
    orderId,
    stars,
    comment,
  ]);
  return result.insertId;
};
