const db = require("../config/db");
const { ok, created, success, fail } = require("../utils/response");

exports.getByProduct = async (req, res, next) => {
  try {
    const [data] = await db.query(
      `SELECT r.*, u.name as user_name, u.avatar as user_avatar FROM reviews r 
       JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC`,
      [req.params.productId]
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

exports.getUserReview = async (req, res, next) => {
  try {
    const [data] = await db.query(
      "SELECT * FROM reviews WHERE product_id = ? AND user_id = ?",
      [req.params.productId, req.user.id]
    );
    return ok(res, data[0] || null);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { product_id, order_id, rating, comment } = req.body;
    if (!product_id || !rating) return fail(res, 400, "Thiếu thông tin bắt buộc (product_id, rating)");
    if (rating < 1 || rating > 5) return fail(res, 400, "Rating phải từ 1 đến 5");
    const [existing] = await db.query("SELECT id FROM reviews WHERE product_id = ? AND user_id = ?", [product_id, user_id]);
    if (existing.length > 0) return fail(res, 400, "Bạn đã đánh giá sản phẩm này rồi");
    const [result] = await db.query(
      "INSERT INTO reviews (product_id, user_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
      [product_id, user_id, order_id || null, rating, comment || null]
    );
    return created(res, { id: result.insertId }, "Đánh giá thành công");
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const reviewId = req.params.id;
    const { rating, comment } = req.body;
    if (rating && (rating < 1 || rating > 5)) return fail(res, 400, "Rating phải từ 1 đến 5");
    const [existing] = await db.query("SELECT id FROM reviews WHERE id = ? AND user_id = ?", [reviewId, user_id]);
    if (existing.length === 0) return fail(res, 403, "Bạn không có quyền sửa đánh giá này");
    await db.query("UPDATE reviews SET rating = COALESCE(?, rating), comment = COALESCE(?, comment) WHERE id = ?", [rating, comment, reviewId]);
    return success(res, "Cập nhật đánh giá thành công");
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const reviewId = req.params.id;
    const [existing] = await db.query("SELECT id FROM reviews WHERE id = ? AND user_id = ?", [reviewId, user_id]);
    if (existing.length === 0) return fail(res, 403, "Bạn không có quyền xóa đánh giá này");
    const [result] = await db.query("DELETE FROM reviews WHERE id = ?", [reviewId]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy đánh giá");
    return success(res, "Xóa đánh giá thành công");
  } catch (err) { next(err); }
};

exports.getProductRating = async (req, res, next) => {
  try {
    const [data] = await db.query(
      "SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE product_id = ?",
      [req.params.productId]
    );
    return ok(res, {
      avg_rating: data[0].avg_rating ? parseFloat(data[0].avg_rating).toFixed(1) : 0,
      total_reviews: data[0].total_reviews || 0,
    });
  } catch (err) { next(err); }
};