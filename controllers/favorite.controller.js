const db = require("../config/db");
const { ok, created, success, fail } = require("../utils/response");

// Lấy danh sách sản phẩm yêu thích của user
exports.getFavorites = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const [data] = await db.query(
      `SELECT f.id as favorite_id, p.* 
       FROM favorite f
       JOIN products p ON f.product_id = p.id
       WHERE f.user_id = ?
       ORDER BY f.id DESC`,
      [user_id]
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

// Thêm sản phẩm vào danh sách yêu thích
exports.addFavorite = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { product_id } = req.body;
    
    if (!product_id) return fail(res, 400, "Vui lòng cung cấp product_id");

    // Kiểm tra sản phẩm có tồn tại không
    const [products] = await db.query("SELECT id FROM products WHERE id = ?", [product_id]);
    if (products.length === 0) return fail(res, 404, "Sản phẩm không tồn tại");

    // Kiểm tra xem đã yêu thích chưa
    const [existing] = await db.query(
      "SELECT id FROM favorite WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );
    
    if (existing.length > 0) return fail(res, 400, "Sản phẩm đã có trong danh sách yêu thích");

    const [result] = await db.query(
      "INSERT INTO favorite (user_id, product_id) VALUES (?, ?)",
      [user_id, product_id]
    );
    
    return created(res, { id: result.insertId }, "Đã thêm vào danh sách yêu thích");
  } catch (err) { next(err); }
};

// Xóa sản phẩm khỏi danh sách yêu thích
exports.removeFavorite = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const product_id = req.params.productId;

    const [result] = await db.query(
      "DELETE FROM favorite WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    if (result.affectedRows === 0) {
      return fail(res, 404, "Sản phẩm không có trong danh sách yêu thích");
    }

    return success(res, "Đã xóa khỏi danh sách yêu thích");
  } catch (err) { next(err); }
};

// Kiểm tra xem sản phẩm có trong danh sách yêu thích không
exports.checkFavorite = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const product_id = req.params.productId;

    const [existing] = await db.query(
      "SELECT id FROM favorite WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    return ok(res, { isFavorite: existing.length > 0 });
  } catch (err) { next(err); }
};
