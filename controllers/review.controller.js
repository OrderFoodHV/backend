const db = require("../config/db");

// Lấy tất cả đánh giá của một sản phẩm
exports.getByProduct = (req, res) => {
  const productId = req.params.productId;
  db.query(
    `SELECT r.*, u.name as user_name, u.avatar as user_avatar 
     FROM reviews r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.product_id = ? 
     ORDER BY r.created_at DESC`,
    [productId],
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data);
    }
  );
};

// Lấy đánh giá của user cho một sản phẩm
exports.getUserReview = (req, res) => {
  const { productId, userId } = req.params;
  db.query(
    "SELECT * FROM reviews WHERE product_id = ? AND user_id = ?",
    [productId, userId],
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data[0] || null);
    }
  );
};

// Tạo mới đánh giá
exports.create = (req, res) => {
  const { product_id, user_id, order_id, rating, comment } = req.body;
  
  if (!product_id || !user_id || !rating) {
    return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
  }
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating phải từ 1 đến 5" });
  }

  // Kiểm tra đã đánh giá chưa
  db.query(
    "SELECT id FROM reviews WHERE product_id = ? AND user_id = ?",
    [product_id, user_id],
    (err, existing) => {
      if (err) return res.status(500).json({ error: err.message });
      if (existing.length > 0) {
        return res.status(400).json({ error: "Bạn đã đánh giá sản phẩm này rồi" });
      }

      db.query(
        "INSERT INTO reviews (product_id, user_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
        [product_id, user_id, order_id || null, rating, comment || null],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ id: result.insertId, message: "Đánh giá thành công" });
        }
      );
    }
  );
};

// Cập nhật đánh giá
exports.update = (req, res) => {
  const reviewId = req.params.id;
  const { rating, comment } = req.body;

  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ error: "Rating phải từ 1 đến 5" });
  }

  db.query(
    "UPDATE reviews SET rating = COALESCE(?, rating), comment = COALESCE(?, comment) WHERE id = ?",
    [rating, comment, reviewId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy đánh giá" });
      }
      res.json({ message: "Cập nhật đánh giá thành công" });
    }
  );
};

// Xóa đánh giá
exports.delete = (req, res) => {
  const reviewId = req.params.id;
  db.query("DELETE FROM reviews WHERE id = ?", [reviewId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy đánh giá" });
    }
    res.json({ message: "Xóa đánh giá thành công" });
  });
};

// Lấy rating trung bình của sản phẩm
exports.getProductRating = (req, res) => {
  const productId = req.params.productId;
  db.query(
    "SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE product_id = ?",
    [productId],
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        avg_rating: data[0].avg_rating ? parseFloat(data[0].avg_rating).toFixed(1) : 0,
        total_reviews: data[0].total_reviews || 0
      });
    }
  );
};